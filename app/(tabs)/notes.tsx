import { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors } from "@/constants/Colors";
import TextApp from "@/components/TextApp";

import MathBlock from "../../components/blocks/MathBlock";
import DiagramEditorBlock from "../../components/blocks/DiagramEditorBlock";
import BarChartEditorBlock from "../../components/blocks/BarChartEditorBlock";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteBlocks,
  createNoteBlock,
  deleteNoteBlock,
} from "@/services/notes";
import type { Note, NoteBlock, BlockType } from "@/lib/database.types";

export default function NotesScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [notes, setNotes] = useState<Note[]>([]);
  const [blocks, setBlocks] = useState<NoteBlock[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  useEffect(() => {
    if (activeNoteId) loadBlocks(activeNoteId);
    else setBlocks([]);
  }, [activeNoteId]);

  const loadNotes = async () => {
    setLoading(true);
    const { data, error } = await getNotes();
    if (error) {
      Alert.alert(t("error"), t("notesLoadFailed"));
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const loadBlocks = async (noteId: string) => {
    const { data } = await getNoteBlocks(noteId);
    setBlocks(data || []);
  };

  const handleAddNote = async () => {
    setSaving(true);
    const { data } = await createNote({
      title: `${t("note")} ${notes.length + 1}`,
    });
    if (data) setNotes([data, ...notes]);
    setSaving(false);
  };

  const handleRemoveNote = async (id: string) => {
    Alert.alert(t("deleteNote"), t("areYouSure"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          setNotes(notes.filter((n) => n.id !== id));
          if (activeNoteId === id) setActiveNoteId(null);
        },
      },
    ]);
  };

  const handleUpdateNote = async (
    id: string,
    updates: { title?: string; content?: string }
  ) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    await updateNote(id, updates);
  };
  const handleDeleteBlock = async (blockId: string) => {
    await deleteNoteBlock(blockId);
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };
  
  const handleAddBlock = async (type: BlockType) => {
    if (!activeNote) return;

    const { data } = await createNoteBlock({
      note_id: activeNote.id,
      type,
      position: blocks.length,
      data: {},
    });

    if (data) setBlocks([...blocks, data]);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.tint} />
        <TextApp style={{ marginTop: 12 }}>
          {t("loadingNotes")}
        </TextApp>
      </View>
    );
  }

  if (!activeNote) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
        <TextApp style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
          {t("notes")}
        </TextApp>

        {notes.map((note) => (
          <View
            key={note.id}
            style={{
              borderWidth: 1,
              borderColor: colors.icon,
              padding: 16,
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveNoteId(note.id)}
              style={{ flex: 1 }}
            >
              <TextApp>{note.title}</TextApp>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRemoveNote(note.id)}>
              <TextApp style={{ color: "#D32F2F", fontSize: 18 }}>
                ✕
              </TextApp>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleAddNote}
          disabled={saving}
          style={{
            marginTop: 20,
            paddingVertical: 18,
            backgroundColor: colors.tint,
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <TextApp style={{ color: colors.background, fontWeight: "600" }}>
              + {t("addNote")}
            </TextApp>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <TouchableOpacity onPress={() => setActiveNoteId(null)} style={{ padding: 10 }}>
        <TextApp style={{ color: colors.tint }}>
          ← {t("back")}
        </TextApp>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRemoveNote(activeNote.id)} style={{ padding: 10 }}>
        <TextApp style={{ color: "#D32F2F" }}>
          {t("deleteNote")}
        </TextApp>
      </TouchableOpacity>

      <TextInput
        value={activeNote.title}
        onChangeText={(text) => handleUpdateNote(activeNote.id, { title: text })}
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      />

      <TextInput
        value={activeNote.content}
        onChangeText={(text) => handleUpdateNote(activeNote.id, { content: text })}
        placeholder={t("writeNote")}
        placeholderTextColor={colors.icon}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.icon,
          padding: 14,
          minHeight: 140,
          marginBottom: 16,
          fontSize: 16,
          color: colors.text,
        }}
      />

      {blocks.map((block) => {
        const onDelete = () => handleDeleteBlock(block.id);
        if (block.type === "diagram")
          return <DiagramEditorBlock key={block.id} onDelete={onDelete} />;
        if (block.type === "bar")
          return <BarChartEditorBlock key={block.id} onDelete={onDelete} />;
        if (block.type === "math")
          return <MathBlock key={block.id} onDelete={onDelete} />;
        return null;
      })}
    </ScrollView>
  );
}
