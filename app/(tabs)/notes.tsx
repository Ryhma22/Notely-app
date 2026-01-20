import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";

import MathBlock from "../../components/blocks/MathBlock";
import DiagramEditorBlock from "../../components/blocks/DiagramEditorBlock";
import BarChartEditorBlock from "../../components/blocks/BarChartEditorBlock";

type ExtraBlock =
  | { id: string; type: "math" }
  | { id: string; type: "diagram" }
  | { id: string; type: "bar" };

type Note = {
  id: string;
  title: string;
  content: string;
  blocks: ExtraBlock[];
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = () => {
    const id = Date.now().toString();
    setNotes([
      ...notes,
      {
        id,
        title: `Note ${notes.length + 1}`,
        content: "",
        blocks: [],
      },
    ]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const addBlock = (type: ExtraBlock["type"]) => {
    if (!activeNote) return;
    setNotes(
      notes.map(n =>
        n.id === activeNote.id
          ? {
              ...n,
              blocks: [...n.blocks, { id: Date.now().toString(), type }],
            }
          : n
      )
    );
    setMenuOpen(false);
  };

  if (!activeNote) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#FFF" }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
          Notes
        </Text>

        {notes.map(note => (
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
            <Text style={{ fontSize: 16 }}>{note.title}</Text>

            <TouchableOpacity
              onPress={() => removeNote(note.id)}
              hitSlop={10}
            >
              <Text style={{ fontSize: 20, color: "#D32F2F" }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={addNote}
          style={{
            marginTop: 20,
            paddingVertical: 18,
            backgroundColor: "#1976D2",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
            + Add note
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          onChangeText={text =>
            setNotes(
              notes.map(n =>
                n.id === activeNote.id ? { ...n, title: text } : n
              )
            )
          }
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
        onChangeText={text =>
          setNotes(
            notes.map(n =>
              n.id === activeNote.id ? { ...n, content: text } : n
            )
          )
        }
        placeholder="Write your note..."
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#DDD",
          padding: 14,
          minHeight: 140,
          marginBottom: 16,
          fontSize: 16,
        }}
      />

      {activeNote.blocks.map(block => {
        const deleteBlock = () =>
          setNotes(
            notes.map(n =>
              n.id === activeNote.id
                ? {
                    ...n,
                    blocks: n.blocks.filter(b => b.id !== block.id),
                  }
                : n
            )
          );

        if (block.type === "diagram") {
          return (
            <DiagramEditorBlock
              key={block.id}
              onDelete={deleteBlock}
            />
          );
        }

        if (block.type === "bar") {
          return (
            <BarChartEditorBlock
              key={block.id}
              onDelete={deleteBlock}
            />
          );
        }
if (block.type === "math") {
  return (
    <MathBlock
      key={block.id}
      onDelete={deleteBlock}
    />
  );
}
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
              onPress={() => addBlock("math")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 16 }}>➕ Math</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addBlock("diagram")}
              style={{ paddingVertical: 14, paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 16 }}>➕ Diagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addBlock("bar")}
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
