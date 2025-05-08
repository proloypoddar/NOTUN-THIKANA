import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate name
    if (name.length < 2) {
      return NextResponse.json(
        { message: 'Invalid name. Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Invalid password. Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Validate Bangladesh phone number
    if (phone) {
      const phoneRegex = /^\+880\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { message: 'Invalid phone number format. Use +8801XXXXXXXXX format for Bangladesh numbers.' },
          { status: 400 }
        );
      }
    }

    // Connect to the database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      verified: false,
      createdAt: new Date(),
      lastActive: new Date()
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
