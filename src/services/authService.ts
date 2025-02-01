import { supabase } from '../config/supabase';

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string) {
  console.log('Attempting login with:', { email });
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (result.error) {
    console.error('Login error:', result.error);
  } else {
    console.log('Login successful:', result.data);
  }
  
  return result;
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function getSession() {
  return supabase.auth.getSession();
}