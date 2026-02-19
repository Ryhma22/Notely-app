import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Note } from "@/lib/database.types";

function cacheKey(userId: string, sortOrder: "newest" | "oldest") {
  return `notely_notes_${userId}_${sortOrder}`;
}

export async function saveNotesToCache(
  notes: Note[],
  sortOrder: "newest" | "oldest"
): Promise<void> {
  const userId = notes[0]?.user_id;
  if (!userId) return;
  try {
    await AsyncStorage.setItem(cacheKey(userId, sortOrder), JSON.stringify(notes));
  } catch {
    // Ignore cache save errors
  }
}

export async function getNotesFromCache(
  userId: string,
  sortOrder: "newest" | "oldest"
): Promise<Note[] | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(userId, sortOrder));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
