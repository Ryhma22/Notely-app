import { supabase } from "@/lib/supabase";
import type { UserSettings, UserSettingsUpdate } from "@/lib/database.types";

export async function getUserSettings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { data: data as UserSettings | null, error };
}

export async function updateUserSettings(updates: UserSettingsUpdate) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  const { data, error } = await supabase
    .from("user_settings")
    .update(updates)
    .eq("user_id", user.id)
    .select()
    .single();

  return { data: data as UserSettings | null, error };
}

// Luo asetukset jos niitä ei ole (fallback jos trigger ei toiminut)
export async function ensureUserSettings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  // Yritä hakea ensin
  const { data: existing } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { data: existing as UserSettings, error: null };
  }

  // Luo jos ei ole
  const { data, error } = await supabase
    .from("user_settings")
    .insert({ user_id: user.id })
    .select()
    .single();

  return { data: data as UserSettings | null, error };
}
