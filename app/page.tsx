import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/LandingPage';

export default async function Home() {
  const { userId } = await auth();

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
