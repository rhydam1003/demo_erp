import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id as string }
  });

  if (!student) {
    redirect('/login');
  }

  return <DashboardClient student={student} />;
}