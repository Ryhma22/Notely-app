import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { deleteNoteBlock } from "@/services/notes";
import type { NoteBlock } from "@/lib/database.types";

export default function ImageBlock({
  block,
  onDelete,
}: {
  block: NoteBlock;
  onDelete: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      !block.data ||
      typeof block.data !== "object" ||
      !("path" in block.data)
    )
      return;

    const path = (block.data as any).path;

    const load = async () => {
      const { data } = await supabase.storage
        .from("note-images")
        .createSignedUrl(path, 60 * 60);

      setUrl(data?.signedUrl ?? null);
    };

    load();
  }, [block.data]);

  const handleDelete = () => {
    Alert.alert("Delete image", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (
            block.data &&
            typeof block.data === "object" &&
            "path" in block.data
          ) {
            const path = (block.data as any).path;

            await supabase.storage
              .from("note-images")
              .remove([path]);
          }

          await deleteNoteBlock(block.id);
          onDelete();
        },
      },
    ]);
  };

  if (!url) {
    return <Text>Loading image…</Text>;
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#DDD",
        padding: 12,
        marginBottom: 16,
        backgroundColor: "#FFF",
      }}
    >
      {/* EDIT BUTTON (same as BarChartEditorBlock) */}
      <View style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 6,
            backgroundColor: "#F5F5F5",
          }}
        >
          <Text>✎</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE */}
      <Image
        source={url}
        style={{ width: "100%", height: 220, borderRadius: 8 }}
        contentFit="contain"
      />

      {/* EDIT PANEL */}
      {open && (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "#D32F2F" }}>
              Delete image
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
