import { supabase } from "../lib/supabaseClient";

// SIGN UP
export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        console.error("Error signing up:", error.message);
    }
}

// SIGN IN
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error("Error signing in:", error.message);
    }
}

// SIGN OUT
export async function signOut() {
    const { error } = await supabase.auth.signOut(); 
    if (error) {
        console.error("Error signing out:", error.message);
    }
}