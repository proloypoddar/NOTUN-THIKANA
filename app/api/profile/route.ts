import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Profile } from '@/lib/db/models/Profile';

// Get the current user's profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get the user's profile
    let profile = await Profile.findOne({ user: user._id });
    
    // If profile doesn't exist, create a new one
    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        preferences: {
          receiveNotifications: true,
          newsletterSubscription: true,
          language: 'Bengali',
        },
      });
    }
    
    // Return the profile with user information
    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      phone: profile.phone || '',
      nid: profile.nid || '',
      dateOfBirth: profile.dateOfBirth || '',
      gender: profile.gender || '',
      occupation: profile.occupation || '',
      bio: profile.bio || '',
      address: profile.address || {
        street: '',
        area: '',
        city: '',
        district: 'Dhaka',
        division: 'Dhaka',
        postalCode: '',
      },
      education: profile.education || {
        level: '',
        institution: '',
        fieldOfStudy: '',
        graduationYear: '',
      },
      emergencyContact: profile.emergencyContact || {
        name: '',
        relation: '',
        phone: '',
      },
      preferences: profile.preferences || {
        receiveNotifications: true,
        newsletterSubscription: true,
        language: 'Bengali',
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update the current user's profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profileData = await request.json();
    
    await dbConnect();
    
    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user's name if provided
    if (profileData.name && profileData.name !== user.name) {
      user.name = profileData.name;
      await user.save();
    }
    
    // Find and update the profile
    const profile = await Profile.findOneAndUpdate(
      { user: user._id },
      {
        phone: profileData.phone,
        nid: profileData.nid,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        occupation: profileData.occupation,
        bio: profileData.bio,
        address: profileData.address,
        education: profileData.education,
        emergencyContact: profileData.emergencyContact,
        preferences: profileData.preferences,
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        email: user.email,
        image: user.image,
        phone: profile.phone,
        nid: profile.nid,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        occupation: profile.occupation,
        bio: profile.bio,
        address: profile.address,
        education: profile.education,
        emergencyContact: profile.emergencyContact,
        preferences: profile.preferences,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
