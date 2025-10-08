import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();
    
    console.log('[API] Fetching courses for student:', session.id);
    
    const student = await prisma.student.findUnique({
      where: { id: session.id as string },
      select: {
        id: true,
        email: true,
        semester: true,
        name: true
      }
    });

    console.log('[API] Student found:', student);

    if (!student) {
      console.error('[API] Student not found with ID:', session.id);
      return NextResponse.json(
        { error: 'Student not found', courses: [] },
        { status: 404 }
      );
    }

    console.log('[API] Looking for courses in semester:', student.semester);

    const courses = await prisma.course.findMany({
      where: { semester: student.semester },
      include: {
        teacher: true,
        feedbacks: {
          where: { studentId: student.id }
        }
      }
    });

    console.log('[API] Courses found in DB:', courses.length);

    if (courses.length === 0) {
      console.warn('[API] No courses found for semester:', student.semester);
      console.warn('[API] Student details:', { id: student.id, semester: student.semester });
    }

    const coursesWithStatus = courses.map(course => {
      const feedbackCompleted = course.feedbacks.length > 0 && course.feedbacks[0].submitted;
      console.log(`[API] Course ${course.code}: feedbackCompleted=${feedbackCompleted}, feedbacks count=${course.feedbacks.length}`);
      
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        semester: course.semester,
        teacher: {
          id: course.teacher.id,
          name: course.teacher.name,
          department: course.teacher.department
        },
        feedbackCompleted
      };
    });

    console.log('[API] Returning courses:', coursesWithStatus.length);

    const response = NextResponse.json({ courses: coursesWithStatus });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('[API] Courses fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', courses: [] },
      { status: 500 }
    );
  }
}