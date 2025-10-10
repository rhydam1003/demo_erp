import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { courseId, courseAnswers, teacherAnswers } = await request.json();

    if (!courseId || !courseAnswers || !teacherAnswers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.upsert({
      where: {
        studentId_courseId: {
          studentId: session.id as string,
          courseId
        }
      },
      update: {
        courseAnswers,
        teacherAnswers,
        submitted: true,
        submittedAt: new Date()
      },
      create: {
        studentId: session.id as string,
        courseId,
        courseAnswers,
        teacherAnswers,
        submitted: true,
        submittedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.id as string,
          courseId
        }
      }
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}