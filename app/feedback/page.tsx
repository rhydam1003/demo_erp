import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import FeedbackListClient from '@/components/FeedbackListClient';

export default async function FeedbackPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <FeedbackListClient />;
}