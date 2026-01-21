// Notely-sovelluksen tietokantatyypit

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Notes
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NoteInsert {
  id?: string;
  user_id?: string;
  title?: string;
  content?: string;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
}

// Note Blocks
export type BlockType = 'math' | 'diagram' | 'bar';

export interface NoteBlock {
  id: string;
  note_id: string;
  type: BlockType;
  data: Json;
  position: number;
  created_at: string;
}

export interface NoteBlockInsert {
  id?: string;
  note_id: string;
  type: BlockType;
  data?: Json;
  position?: number;
}

export interface NoteBlockUpdate {
  type?: BlockType;
  data?: Json;
  position?: number;
}

// Profiles
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
}

// User Settings
export interface UserSettings {
  user_id: string;
  dark_mode: boolean;
  language: string;
  font_size: string;
  calculator_precision: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsUpdate {
  dark_mode?: boolean;
  language?: string;
  font_size?: string;
  calculator_precision?: number;
}
