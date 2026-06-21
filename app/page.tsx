import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'edge'

export default async function Home() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
}
