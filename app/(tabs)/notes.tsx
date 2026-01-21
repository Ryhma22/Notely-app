import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [blocks, setBlocks] = useState<NoteBlock[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Lataa muistiinpanot kun näkymä avataan
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  // Lataa lohkot kun muistiinpano valitaan
  useEffect(() => {
    if (activeNoteId) {
      loadBlocks(activeNoteId);
    } else {
      setBlocks([]);
    }
  }, [activeNoteId]);

  const loadNotes = async () => {
    setLoading(true);
    const { data, error } = await getNotes();
    if (error) {
      Alert.alert("Virhe", "Muistiinpanojen lataus epäonnistui");
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
    const { data, error } = await createNote({
      title: `Note ${notes.length + 1}`,
    });
    if (error) {
      Alert.alert("Virhe", "Muistiinpanon luonti epäonnistui");
    } else if (data) {
      setNotes([data, ...notes]);
    }
    setSaving(false);
  };

  const handleRemoveNote = async (id: string) => {
    Alert.alert("Poista muistiinpano", "Haluatko varmasti poistaa tämän?", [
      { text: "Peruuta", style: "cancel" },
      {
        text: "Poista",
        style: "destructive",
        onPress: async () => {
          const { error } = await deleteNote(id);
          if (error) {
            Alert.alert("Virhe", "Poisto epäonnistui");
          } else {
            setNotes(notes.filter((n) => n.id !== id));
            if (activeNoteId === id) setActiveNoteId(null);
          }
        },
      },
    ]);
  };

  const handleUpdateNote = async (id: string, updates: { title?: string; content?: string }) => {
    // Päivitä lokaalisti heti
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    
    // Tallenna tietokantaan (debounce olisi hyvä lisätä tuotantoon)
    const { error } = await updateNote(id, updates);
    if (error) {
      console.error("Tallennus epäonnistui:", error);
    }
  };

  const handleAddBlock = async (type: BlockType) => {
    if (!activeNote) return;
    setMenuOpen(false);

    const newPosition = blocks.length;
    const { data, error } = await createNoteBlock({
      note_id: activeNote.id,
      type,
      position: newPosition,
      data: {},
    });

    if (error) {
      Alert.alert("Virhe", "Lohkon lisäys epäonnistui");
    } else if (data) {
      setBlocks([...blocks, data]);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    const { error } = await deleteNoteBlock(blockId);
    if (error) {
      Alert.alert("Virhe", "Lohkon poisto epäonnistui");
    } else {
      setBlocks(blocks.filter((b) => b.id !== blockId));
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={{ marginTop: 12, color: "#666" }}>Ladataan muistiinpanoja...</Text>
      </View>
    );
  }

  // Notes list view
  if (!activeNote) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#FFF" }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
          Notes
        </Text>

        {notes.length === 0 ? (
          <Text style={{ color: "#666", textAlign: "center", marginTop: 40 }}>
            Ei muistiinpanoja vielä. Luo ensimmäinen!
          </Text>
        ) : (
          notes.map((note) => (
            <TouchableOpacity
              key={note.id}
              onPress={() => setActiveNoteId(note.id)}
              style={{
                borderWidth: 1,
                borderColor: "#DDD",
                paddingVertical: 18,
                paddingHorizontal: 16,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FAFAFA",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>{note.title}</Text>
                {note.content ? (
                  <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }} numberOfLines={1}>
                    {note.content}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveNote(note.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ fontSize: 20, color: "#D32F2F" }}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          onPress={handleAddNote}
          disabled={saving}
          style={{
            marginTop: 20,
            paddingVertical: 18,
            backgroundColor: saving ? "#90CAF9" : "#1976D2",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
              + Add note
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // Note editor view
  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#FFF" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveNoteId(null)}
          style={{ padding: 10 }}
        >
          <Text style={{ color: "#1976D2", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <TextInput
          value={activeNote.title}
          onChangeText={(text) => handleUpdateNote(activeNote.id, { title: text })}
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "600",
            paddingVertical: 8,
            paddingHorizontal: 12,
            textAlign: "center",
          }}
        />

        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={{ padding: 10 }}
        >
          <Text style={{ fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={activeNote.content}
        onChangeText={(text) => handleUpdateNote(activeNote.id, { content: text })}
        placeholder="Write your note..."
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          padding: 14,
          minHeight: 140,
          marginBottom: 16,
          fontSize: 16,
          textAlignVertical: "top",
        }}
      />

      {blocks.map((block) => {
        const onDelete = () => handleDeleteBlock(block.id);

        if (block.type === "diagram") {
          return <DiagramEditorBlock key={block.id} onDelete={onDelete} />;
        }

        if (block.type === "bar") {
          return <BarChartEditorBlock key={block.id} onDelete={onDelete} />;
        }

        if (block.type === "math") {
          return <MathBlock key={block.id} onDelete={onDelete} />;
        }

        return null;
      })}

      <Modal
        transparent
        animationType="fade"
        visible={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          onPress={() => setMenuOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            paddingTop: 60,
            paddingRight: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 8,
              paddingVertical: 12,
              width: 200,
            }}
          >
            <TouchableOpacity
              onPress={() => handleAddBlock("math")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 16 }}>➕ Math</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddBlock("diagram")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 16 }}>➕ Diagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddBlock("bar")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 16 }}>➕ Bar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
