'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎉 Feedback Submitted Successfully!
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Your feedback for all courses has been successfully submitted.
          Thank you for your valuable input!
        </p>

        <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50 mb-8">
          <h3 className="font-bold text-gray-800 mb-4 text-xl">Submission Summary</h3>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-bold text-green-600">✓ Completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submission Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Feedback Status:</span>
              <span className="font-medium text-orange-600">🔒 Locked</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 italic mb-8">
          Note: You cannot edit the feedback after final submission.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}