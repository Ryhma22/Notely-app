import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import BarChartBlock from "./BarChartBlock";
import { useI18n } from "@/hooks/use-i18n";
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
        borderColor: "#DDD",
        padding: 12,
        marginBottom: 16,
        backgroundColor: "#FFF",
      }}
    >
      {/* EDIT BUTTON (top-right like DiagramEditorBlock) */}
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

      {/* TITLE */}
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
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )}

      {/* CHART */}
      <BarChartBlock data={bars} />

      {/* EDIT PANEL */}
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
                onChangeText={(v) => updateBar(i, "label", v)}
                style={{
                  borderWidth: 1,
                  borderColor: "#CCC",
                  padding: 6,
                  width: 80,
                }}
              />
              <TextInput
                value={String(b.value)}
                placeholder={t("value")}
                keyboardType="numeric"
                onChangeText={(v) => updateBar(i, "value", v)}
                style={{
                  borderWidth: 1,
                  borderColor: "#CCC",
                  padding: 6,
                  width: 60,
                }}
              />
              <TouchableOpacity onPress={() => removeBar(i)}>
                <Text style={{ color: "#D32F2F", fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={addBar} style={{ marginTop: 6 }}>
            <Text style={{ color: "#1976D2" }}>
              {t("addBar")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={{ marginTop: 12 }}>
            <Text style={{ color: "#D32F2F" }}>
              {t("deleteChart")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
