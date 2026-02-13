import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/hooks/use-i18n";
import { useSettings } from "@/hooks/use-settings";
import { Colors, DANGER_COLOR } from "@/constants/Colors";
import TextApp from "@/components/TextApp";
import type { NoteBlock } from "@/lib/database.types";

export default function ImageBlock({
  block,
  onDelete,
}: {
  block: NoteBlock;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const { isDark } = useSettings();
  const colors = isDark ? Colors.dark : Colors.light;

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
    Alert.alert(t("deleteImage"), t("deleteImageConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          if (
            block.data &&
            typeof block.data === "object" &&
            "path" in block.data
          ) {
            const path = (block.data as any).path;
            await supabase.storage.from("note-images").remove([path]);
          }
          onDelete();
        },
      },
    ]);
  };

  if (!url) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.icon + "50",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <TextApp style={{ color: colors.icon }}>{t("loadingImage")}</TextApp>
      </View>
    );
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.icon + "50",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        backgroundColor: colors.background,
      }}
    >
      {/* Muokkaa-painike */}
      <View style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: colors.icon + "50",
            borderRadius: 6,
            backgroundColor: colors.icon + "20",
          }}
        >
          <Text style={{ color: colors.text }}>✎</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={url}
        style={{ width: "100%", height: 220, borderRadius: 8 }}
        contentFit="contain"
      />

      {open && (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: DANGER_COLOR }}>{t("deleteImage")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
