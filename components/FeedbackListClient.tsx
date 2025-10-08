'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ChevronRight, ArrowLeft } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  teacher: {
    id: string;
    name: string;
    department: string;
  };
  feedbackCompleted: boolean;
}

export default function FeedbackListClient() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string>('');

  useEffect(() => {
    // Reset all state on mount
    setCourses([]);
    setFinalSubmitted(false);
    setCurrentStudentId('');
    
    fetchCoursesAndStatus();
  }, []);

  const fetchCoursesAndStatus = async () => {
    setLoading(true);
    try {
      // First, get current student info
      const studentResponse = await fetch('/api/auth/me', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!studentResponse.ok) {
        router.push('/login');
        return;
      }
      
      const studentData = await studentResponse.json();
      
      if (!studentData.student) {
        router.push('/login');
        return;
      }
      
      setCurrentStudentId(studentData.student.id);

      // Fetch courses with no-cache
      const coursesResponse = await fetch('/api/courses', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!coursesResponse.ok) {
        console.error('Failed to fetch courses');
        setCourses([]);
        setFinalSubmitted(false);
        setLoading(false);
        return;
      }
      
      const coursesData = await coursesResponse.json();
      
      // Always set courses, even if empty
      const fetchedCourses = coursesData.courses || [];
      console.log('Fetched courses:', fetchedCourses.length);
      setCourses(fetchedCourses);

      // Check final submission status for THIS student with no-cache
      const submissionResponse = await fetch('/api/feedback/final-submit', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!submissionResponse.ok) {
        console.error('Failed to fetch submission status');
        setFinalSubmitted(false);
        setLoading(false);
        return;
      }
      
      const submissionData = await submissionResponse.json();
      console.log('Submission data:', submissionData);
      
      // Verify the submission belongs to current student
      if (submissionData.submission && 
          submissionData.submission.studentId === studentData.student.id &&
          submissionData.submission.finalSubmit === true) {
        console.log('Student has final submitted');
        setFinalSubmitted(true);
      } else {
        console.log('Student has NOT final submitted');
        setFinalSubmitted(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFinalSubmitted(false);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm('Are you sure? You cannot edit feedback after final submission.')) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/feedback/final-submit', {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      alert('🎉 All feedbacks submitted successfully!');
      setFinalSubmitted(true);
      router.push('/feedback/success');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const allCompleted = courses.every(c => c.feedbackCompleted);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6 pb-6 border-b-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Feedback Section</h1>
            <p className="text-gray-600 mt-2">Current Semester Courses</p>
          </div>

          {/* Courses List */}
          <div className="space-y-4 mb-6">
            {courses.length === 0 ? (
              <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">
                <p className="text-yellow-800 font-medium">
                  No courses found for your semester.
                </p>
              </div>
            ) : (
              courses.map(course => (
                <div
                  key={course.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-blue-600">{course.code}</span>
                        <span className="text-lg font-semibold text-gray-800">{course.name}</span>
                      </div>
                      <p className="text-gray-600">
                        <span className="font-medium">Teacher:</span> {course.teacher.name}
                      </p>
                      <p className="text-sm text-gray-500">{course.teacher.department}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {course.feedbackCompleted ? (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">Completed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-red-600" />
                            <span className="text-sm font-semibold text-red-600">Pending</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => router.push(`/feedback/${course.id}`)}
                        disabled={finalSubmitted}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                          finalSubmitted
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : course.feedbackCompleted
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {course.feedbackCompleted ? 'View' : 'Give Feedback'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Final Submit Button */}
          {courses.length > 0 && allCompleted && !finalSubmitted && (
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:bg-green-300"
            >
              {submitting ? 'Submitting...' : '✓ Final Submit All Feedbacks'}
            </button>
          )}

          {courses.length > 0 && finalSubmitted && (
            <div className="p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-lg font-bold text-green-800">All Feedbacks Submitted Successfully!</p>
              <p className="text-sm text-green-700 mt-2">Your feedback has been locked and cannot be edited.</p>
            </div>
          )}

          {courses.length > 0 && !allCompleted && !finalSubmitted && (
            <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
              <p className="text-yellow-800 font-medium">
                ⚠️ Complete feedback for all courses to enable Final Submit
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Completed: {courses.filter(c => c.feedbackCompleted).length} / {courses.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}