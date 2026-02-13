import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import BarChartBlock from "./BarChartBlock";
import { useI18n } from "@/hooks/use-i18n";
import { useSettings } from "@/hooks/use-settings";
import { Colors, DANGER_COLOR } from "@/constants/Colors";
import type { NoteBlock } from "@/lib/database.types";

type Bar = { label: string; value: number };

export default function BarChartEditorBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: NoteBlock;
  onUpdate: (data: any) => void;
  onDelete?: () => void;
}) {
  const { t } = useI18n();
  const { isDark } = useSettings();
  const colors = isDark ? Colors.dark : Colors.light;

  const [open, setOpen] = useState(false);

  const initialData =
    typeof block.data === "object" &&
    block.data !== null &&
    !Array.isArray(block.data)
      ? block.data
      : {};

  const [bars, setBars] = useState<Bar[]>(
    Array.isArray((initialData as any).bars)
      ? (initialData as any).bars
      : [
          { label: "A", value: 3 },
          { label: "B", value: 5 },
        ]
  );

  const [title, setTitle] = useState(
    typeof (initialData as any).title === "string"
      ? (initialData as any).title
      : t("barChart")
  );

  const [editingTitle, setEditingTitle] = useState(false);

  // 🔥 persist changes
  useEffect(() => {
    onUpdate({
      title,
      bars,
    });
  }, [title, bars]);

  const updateBar = (i: number, key: "label" | "value", v: string) => {
    const next = [...bars];
    next[i] = { ...next[i], [key]: key === "value" ? Number(v) : v };
    setBars(next);
  };

  const addBar = () => {
    setBars([...bars, { label: "", value: 0 }]);
  };

  const removeBar = (i: number) => {
    setBars(bars.filter((_, idx) => idx !== i));
  };

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

      {editingTitle ? (
        <TextInput
          value={title}
          onChangeText={setTitle}
          onBlur={() => setEditingTitle(false)}
          autoFocus
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
            textAlign: "center",
            color: colors.text,
          }}
        />
      ) : (
        <TouchableOpacity onPress={() => setEditingTitle(true)}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
              textAlign: "center",
              color: colors.text,
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )}

      <BarChartBlock data={bars} />

      {open && (
        <View style={{ marginTop: 12 }}>
          {bars.map((b, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <TextInput
                value={b.label}
                placeholder={t("label")}
                placeholderTextColor={colors.icon}
                onChangeText={(v) => updateBar(i, "label", v)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.icon + "50",
                  padding: 6,
                  width: 80,
                  color: colors.text,
                }}
              />
              <TextInput
                value={String(b.value)}
                placeholder={t("value")}
                placeholderTextColor={colors.icon}
                keyboardType="numeric"
                onChangeText={(v) => updateBar(i, "value", v)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.icon + "50",
                  padding: 6,
                  width: 60,
                  color: colors.text,
                }}
              />
              <TouchableOpacity onPress={() => removeBar(i)}>
                <Text style={{ color: DANGER_COLOR, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={addBar} style={{ marginTop: 6 }}>
            <Text style={{ color: colors.tint }}>{t("addBar")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={{ marginTop: 12 }}>
            <Text style={{ color: DANGER_COLOR }}>{t("deleteChart")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
