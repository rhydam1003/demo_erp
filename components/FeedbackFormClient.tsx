'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const courseQuestions = [
  "The syllabus was covered completely and systematically",
  "The course content was relevant and up-to-date",
  "Assignments and practicals helped in better understanding",
  "Study materials provided were helpful",
  "The pace of the course was appropriate",
  "Learning objectives were clearly defined",
  "Course workload was manageable",
  "Overall course quality was excellent"
];

const teacherQuestions = [
  "Teacher explains concepts clearly and effectively",
  "Teacher is punctual and regular to classes",
  "Teacher encourages student participation",
  "Teacher is approachable for doubts and queries",
  "Teacher uses effective teaching methods",
  "Teacher shows enthusiasm for the subject",
  "Teacher provides constructive feedback",
  "Teacher's overall performance is excellent"
];

// Reusable component for the Likert scale radio group
const RatingScale = ({ value, index, type, setAnswers, answers, colorClass }: {
  value: number;
  index: number;
  type: 'course' | 'teacher';
  setAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  answers: number[];
  colorClass: string; // e.g., 'text-blue-600'
}) => (
  <label key={value} className="flex flex-col items-center gap-2 cursor-pointer group">
    <input
      type="radio"
      name={`${type}-${index}`}
      value={value}
      checked={answers[index] === value}
      onChange={() => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
      }}
      // Note: Tailwind requires custom styling for radio button colors in some cases
      className={`w-5 h-5 ${colorClass} cursor-pointer`}
      required
    />
    <span className={`text-sm font-medium text-gray-700 group-hover:${colorClass.replace('text-', 'text-')}`}>
      {value}
    </span>
  </label>
);

export default function FeedbackFormClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initialize with 0 (unanswered)
  const [courseAnswers, setCourseAnswers] = useState<number[]>(Array(courseQuestions.length).fill(0));
  const [teacherAnswers, setTeacherAnswers] = useState<number[]>(Array(teacherQuestions.length).fill(0));

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch course list to find the specific course details
      const courseListResponse = await fetch('/api/courses');
      const courseListData = await courseListResponse.json();
      const foundCourse = courseListData.courses?.find((c: any) => c.id === courseId);
      setCourse(foundCourse);

      if (!foundCourse) return;

      // 2. Check if feedback already exists for pre-filling
      const feedbackResponse = await fetch(`/api/feedback?courseId=${courseId}`);
      const feedbackData = await feedbackResponse.json();

      if (feedbackData.feedback) {
        setCourseAnswers(feedbackData.feedback.courseAnswers || Array(courseQuestions.length).fill(0));
        setTeacherAnswers(feedbackData.feedback.teacherAnswers || Array(teacherQuestions.length).fill(0));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all questions answered (check for 0)
    if (courseAnswers.includes(0) || teacherAnswers.includes(0)) {
      alert('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseAnswers,
          teacherAnswers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      alert('✓ Feedback submitted successfully!');
      router.push('/feedback'); // Go back to list
      router.refresh(); // Refresh the list status
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Course not found or unauthorized</p>
          <button
            onClick={() => router.push('/feedback')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b-2">
            <button
              onClick={() => router.push('/feedback')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Course List</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Feedback Form</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-lg font-bold text-blue-600">{course.code}</span>
              <span className="text-lg text-gray-700">{course.name}</span>
            </div>
            <p className="text-gray-600 mt-2">Teacher: {course.teacherName}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Part A: Course Feedback */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                Part A: Course Feedback
              </h2>

              <div className="space-y-6">
                {courseQuestions.map((question, index) => (
                  <div key={`course-${index}`} className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 hover:border-blue-300 transition-colors">
                    <p className="font-medium text-gray-800 mb-4">
                      <span className="text-blue-600 font-bold">Q{index + 1}.</span> {question}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <RatingScale
                            key={value}
                            value={value}
                            index={index}
                            type="course"
                            setAnswers={setCourseAnswers}
                            answers={courseAnswers}
                            colorClass="text-blue-600"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>Strongly Disagree (1)</span>
                      <span>Strongly Agree (5)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Part B: Teacher Feedback */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                Part B: Teacher Feedback
              </h2>

              <div className="space-y-6">
                {teacherQuestions.map((question, index) => (
                  <div key={`teacher-${index}`} className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 hover:border-green-300 transition-colors">
                    <p className="font-medium text-gray-800 mb-4">
                      <span className="text-green-600 font-bold">Q{index + 1}.</span> {question}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <RatingScale
                            key={value}
                            value={value}
                            index={index}
                            type="teacher"
                            setAnswers={setTeacherAnswers}
                            answers={teacherAnswers}
                            colorClass="text-green-600"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>Strongly Disagree (1)</span>
                      <span>Strongly Agree (5)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:bg-blue-300"
            >
              {submitting ? 'Submitting...' : '✓ Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}