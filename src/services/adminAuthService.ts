import { supabase } from '../config/supabase';

export async function adminSignIn(email: string, password: string) {
  try {
    // First attempt authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user data returned');
    }

    // Then verify admin status
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', authData.user.id)
      .single();

    if (adminError) {
      console.error('Admin verification error:', adminError);
      await supabase.auth.signOut();
      throw new Error('Admin verification failed');
    }

    if (!adminData) {
      await supabase.auth.signOut();
      throw new Error('Unauthorized access');
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error('Admin login error:', error);
    return { data: null, error };
  }
}

export async function verifyAdminStatus() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log('No active session');
      return false;
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (adminError) {
      console.error('Admin verification error:', adminError);
      return false;
    }

    return !!adminData;
  } catch (error) {
    console.error('Admin verification error:', error);
    return false;
  }
}