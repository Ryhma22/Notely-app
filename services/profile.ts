import { supabase } from "@/lib/supabase";
import type { Profile, ProfileUpdate } from "@/lib/database.types";

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { data: data as Profile | null, error };
}

export async function updateProfile(updates: ProfileUpdate) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  return { data: data as Profile | null, error };
}

// Luo profiili jos sitä ei ole (fallback jos trigger ei toiminut)
export async function ensureProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  // Yritä hakea ensin
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) {
    return { data: existing as Profile, error: null };
  }

  // Luo jos ei ole
  const { data, error } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select()
    .single();

  return { data: data as Profile | null, error };
}
