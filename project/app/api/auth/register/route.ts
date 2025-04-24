import { NextResponse } from 'next/server';
import { createUser, userExists, validateUserEmail, validateUserPassword, validateUserName } from '@/database';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate name
    if (!validateUserName(name)) {
      return NextResponse.json(
        { message: 'Invalid name. Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateUserEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Validate password
    if (!validateUserPassword(password)) {
      return NextResponse.json(
        { message: 'Invalid password. Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (userExists(email)) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = createUser(name, email, password);

    // Return success response
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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
