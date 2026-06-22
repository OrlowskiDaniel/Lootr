import { supabase } from "../lib/supabaseClient";

// SIGN UP
// Store username in user_metadata so it survives email confirmation.
// The profile row is created by the DB trigger on auth.users insert.
// useAuth will sync the username into profiles on first SIGNED_IN event.
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // stored in raw_user_meta_data
    },
  });

  if (error) throw error;
  return data;
}

// GOOGLE OAUTH
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  if (error) throw error;
  return data;
}

// SIGN IN
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// SIGN OUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}