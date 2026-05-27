import { supabase } from "../lib/supabaseClient";

// SIGN UP
export async function signUp(email, password) {

  // We remove the hardcoded 'mode' check so it's a pure reusable action
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
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