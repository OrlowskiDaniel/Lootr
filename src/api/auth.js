import { supabase } from "../lib/supabaseClient";

// SIGN UP
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Maak profiel aan
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: data.user.id,
      user_id: data.user.id,
      username: username,
      avatar_url: '/default-avatar.png'
    }])

  if (profileError) throw profileError;

  return data;
}

// SIGN IN
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// SIGN OUT
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}