import { supabase } from "@/lib/supabase";
import type { Note, NoteInsert, NoteUpdate, NoteBlock, NoteBlockInsert, NoteBlockUpdate } from "@/lib/database.types";
import { saveNotesToCache, getNotesFromCache } from "@/utils/notesCache";

// ============ NOTES ============

export type NoteSortOrder = "newest" | "oldest";

export type GetNotesResult = {
  data: Note[] | null;
  error: { message: string } | null;
  fromCache?: boolean;
};

export async function getNotes(sortOrder: NoteSortOrder = "newest"): Promise<GetNotesResult> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: sortOrder === "oldest" });

  if (!error && data) {
    await saveNotesToCache(data as Note[], sortOrder);
  }

  if (error && user) {
    const cached = await getNotesFromCache(user.id, sortOrder);
    if (cached) {
      return { data: cached, error: null, fromCache: true };
    }
  }

  return { data: data as Note[] | null, error, fromCache: false };
}

export async function getNote(id: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as Note | null, error };
}

export async function createNote(note: NoteInsert = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: { message: "Käyttäjä ei ole kirjautunut" } };
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: note.title || "Untitled",
      content: note.content || "",
    })
    .select()
    .single();

  return { data: data as Note | null, error };
}

export async function toggleNoteFavorite(id: string, isFavorite: boolean) {
  return updateNote(id, { is_favorite: isFavorite });
}

export async function updateNote(id: string, updates: NoteUpdate) {
  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data: data as Note | null, error };
}

export async function deleteNote(id: string) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  return { error };
}

// ============ NOTE BLOCKS ============

export async function getNoteBlocks(noteId: string) {
  const { data, error } = await supabase
    .from("note_blocks")
    .select("*")
    .eq("note_id", noteId)
    .order("position", { ascending: true });

  return { data: data as NoteBlock[] | null, error };
}

export async function createNoteBlock(block: NoteBlockInsert) {
  const { data, error } = await supabase
    .from("note_blocks")
    .insert(block)
    .select()
    .single();

  return { data: data as NoteBlock | null, error };
}

export async function updateNoteBlock(id: string, updates: NoteBlockUpdate) {
  const { data, error } = await supabase
    .from("note_blocks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data: data as NoteBlock | null, error };
}

export async function deleteNoteBlock(id: string) {
  const { error } = await supabase
    .from("note_blocks")
    .delete()
    .eq("id", id);

  return { error };
}

// ============ NOTE WITH BLOCKS ============

export async function getNoteWithBlocks(id: string) {
  const [noteResult, blocksResult] = await Promise.all([
    getNote(id),
    getNoteBlocks(id),
  ]);

  return {
    note: noteResult.data,
    blocks: blocksResult.data || [],
    error: noteResult.error || blocksResult.error,
  };
}
