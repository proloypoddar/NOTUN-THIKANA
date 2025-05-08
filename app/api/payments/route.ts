import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Payment } from '@/lib/db/models/Payment';
import { Booking } from '@/lib/db/models/Booking';
import { Notification } from '@/lib/db/models/Notification';
import { pusherServer } from '@/lib/pusher';
import { CHANNELS, EVENTS } from '@/lib/pusher';
import { v4 as uuidv4 } from 'uuid';

// GET /api/payments - Get all payments for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    await dbConnect();
    
    let query = {};
    
    // Filter payments based on user role
    if (role === 'payer') {
      query = { payer: session.user.id };
    } else if (role === 'receiver') {
      query = { receiver: session.user.id };
    } else if (session.user.role === 'admin') {
      // Admin can see all payments
    } else {
      // Default to payer view for regular users
      query = { payer: session.user.id };
    }
    
    const payments = await Payment.find(query)
      .populate('booking', 'startDate endDate status')
      .populate('property', 'title images')
      .populate('payer', 'name email image')
      .populate('receiver', 'name email image')
      .sort({ paymentDate: -1 });
    
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { bookingId, amount, paymentMethod, notes } = await request.json();
    
    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('landlord');
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify that the current user is the tenant
    if (booking.tenant.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to make payment for this booking' },
        { status: 403 }
      );
    }
    
    // Generate a unique transaction ID
    const transactionId = `TXN-${uuidv4().substring(0, 8)}-${Date.now().toString().substring(7)}`;
    
    // Create payment
    const payment = await Payment.create({
      booking: bookingId,
      property: booking.property._id,
      payer: session.user.id,
      receiver: booking.landlord._id,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed', // For demo purposes, we'll mark it as completed immediately
      notes,
      metadata: {
        bookingStatus: booking.status,
        propertyTitle: booking.property.title
      }
    });
    
    // Update booking payment status
    const totalPaid = amount;
    let paymentStatus = 'unpaid';
    
    if (totalPaid >= booking.totalAmount) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partially_paid';
    }
    
    booking.paymentStatus = paymentStatus;
    booking.paymentId = payment._id;
    await booking.save();
    
    // Create notification for landlord
    await Notification.create({
      title: 'Payment Received',
      message: `You have received a payment of ${amount} BDT for ${booking.property.title}`,
      type: 'rental',
      recipient: booking.landlord._id,
      sender: session.user.id,
      isRead: false,
      description: `Payment via ${paymentMethod}`,
      urgency: 'regular',
      relatedId: payment._id,
      onModel: 'Payment'
    });
    
    // Send real-time notification
    try {
      const landlordSocketId = booking.landlord._id.toString();
      pusherServer.trigger(
        `${CHANNELS.NOTIFICATIONS}-${landlordSocketId}`,
        EVENTS.NEW_NOTIFICATION,
        {
          title: 'Payment Received',
          message: `You have received a payment of ${amount} BDT for ${booking.property.title}`
        }
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    
    return NextResponse.json(
      { 
        message: 'Payment processed successfully',
        payment: {
          id: payment._id,
          transactionId: payment.transactionId,
          amount: payment.amount,
          status: payment.status,
          paymentDate: payment.paymentDate
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
