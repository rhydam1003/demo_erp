import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import FeedbackFormClient from '@/components/FeedbackFormClient';

export default async function FeedbackFormPage({
  params
}: {
  params: { courseId: string }
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <FeedbackFormClient courseId={params.courseId} />;
}