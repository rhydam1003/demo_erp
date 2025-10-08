import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST() {
  try {
    const session = await requireAuth();
    
    const student = await prisma.student.findUnique({
      where: { id: session.id as string }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const courses = await prisma.course.findMany({
      where: { semester: student.semester }
    });

    const feedbacks = await prisma.feedback.findMany({
      where: {
        studentId: student.id,
        courseId: { in: courses.map(c => c.id) },
        submitted: true
      }
    });

    if (feedbacks.length !== courses.length) {
      return NextResponse.json(
        { error: 'Please complete feedback for all courses' },
        { status: 400 }
      );
    }

    const submission = await prisma.feedbackSubmission.upsert({
      where: { studentId: student.id },
      update: {
        finalSubmit: true,
        submittedAt: new Date()
      },
      create: {
        studentId: student.id,
        semester: student.semester,
        finalSubmit: true,
        submittedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'All feedbacks submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Final submit error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    const session = await requireAuth();
    
    // IMPORTANT: Only fetch submission for THIS specific student
    const submission = await prisma.feedbackSubmission.findUnique({
      where: { 
        studentId: session.id as string  // Must match current logged-in student
      }
    });

    // Create response with no-cache headers
    const response = NextResponse.json({ 
      submission: submission || null 
    });

    // Prevent any caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Submission status fetch error:', error);
    return NextResponse.json(
      { error: 'Unauthorized', submission: null },
      { status: 401 }
    );
  }
}