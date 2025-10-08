import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, rollNo, semester, branch } = await request.json();

    if (!name || !email || !password || !rollNo || !semester || !branch) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email },
          { rollNo }
        ]
      }
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this email or roll number already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rollNo,
        semester: parseInt(semester),
        branch
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}