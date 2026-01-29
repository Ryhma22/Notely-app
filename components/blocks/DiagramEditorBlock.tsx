import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DiagramBlock from "./DiagramBlock";
import { useI18n } from "@/hooks/use-i18n";
import type { NoteBlock } from "@/lib/database.types";

type Point = { x: number; y: number };

export default function DiagramEditorBlock({
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
  typeof block.data === "object" && block.data !== null && !Array.isArray(block.data)
    ? block.data
    : {};

const [points, setPoints] = useState<Point[]>(
  Array.isArray((initialData as any).points)
    ? (initialData as any).points
    : [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ]
);

const [lineMode, setLineMode] = useState<
  "trend" | "straight" | "wave"
>(
  (initialData as any).lineMode === "straight" ||
  (initialData as any).lineMode === "wave"
    ? (initialData as any).lineMode
    : "trend"
);

const [title, setTitle] = useState(
  typeof (initialData as any).title === "string"
    ? (initialData as any).title
    : t("diagram")
);

useEffect(() => {
  onUpdate({
    title,
    lineMode,
    points,
  });
}, [title, lineMode, points]);


  const [editingTitle, setEditingTitle] = useState(false);
  

  const updatePoint = (i: number, key: "x" | "y", v: string) => {
    const next = [...points];
    next[i] = { ...next[i], [key]: Number(v) };
    setPoints(next);
  };

  const addPoint = () => {
    setPoints([...points, { x: points.length + 1, y: 0 }]);
  };

  const removePoint = (i: number) => {
    setPoints(points.filter((_, idx) => idx !== i));
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
      {/* EDIT BUTTON */}
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
      <DiagramBlock data={points} lineMode={lineMode} />

      {/* EDIT PANEL */}
      {open && (
        <View style={{ marginTop: 12 }}>
          {/* LINE MODE */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            {(["trend", "straight", "wave"] as const).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setLineMode(m)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: lineMode === m ? "#1976D2" : "#CCC",
                }}
              >
                <Text>{t(m)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* POINTS */}
          {points.map((p, i) => (
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
                value={String(p.x)}
                placeholder={t("x")}
                keyboardType="numeric"
                onChangeText={(v) => updatePoint(i, "x", v)}
                style={{
                  borderWidth: 1,
                  borderColor: "#CCC",
                  padding: 6,
                  width: 60,
                }}
              />
              <TextInput
                value={String(p.y)}
                placeholder={t("y")}
                keyboardType="numeric"
                onChangeText={(v) => updatePoint(i, "y", v)}
                style={{
                  borderWidth: 1,
                  borderColor: "#CCC",
                  padding: 6,
                  width: 60,
                }}
              />
              <TouchableOpacity onPress={() => removePoint(i)}>
                <Text style={{ color: "#D32F2F", fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* ADD / DELETE */}
          <TouchableOpacity onPress={addPoint} style={{ marginTop: 6 }}>
            <Text style={{ color: "#1976D2" }}>
              {t("addPoint")}
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
