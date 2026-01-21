import { supabase } from "../lib/supabase";

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function deleteAccount() {
  // Käyttäjän poisto vaatii service_role avaimen,
  // joten teemme sen Edge Functionin kautta tai
  // kutsumme RPC-funktiota tietokannasta
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "Käyttäjää ei löydy" } };
  }
  
  // Kutsu tietokantafunktiota joka poistaa käyttäjän
  const { error } = await supabase.rpc('delete_user');
  return { error };
}

export function onAuthStateChange(cb: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
  return supabase.auth.onAuthStateChange(cb);
}
