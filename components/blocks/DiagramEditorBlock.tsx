import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DiagramBlock from "./DiagramBlock";

type Point = { x: number; y: number };

export default function DiagramEditorBlock({
  onDelete,
}: {
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState<Point[]>([
    { x: 1, y: 2 },
    { x: 2, y: 4 },
  ]);

  const [title, setTitle] = useState("Diagram");
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
    }}
  />
) : (
  <TouchableOpacity onPress={() => setEditingTitle(true)}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
)}

      <DiagramBlock data={points} />

      {open && (
        <View style={{ marginTop: 12 }}>
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
                placeholder="x"
                keyboardType="numeric"
                onChangeText={v => updatePoint(i, "x", v)}
                style={{ borderWidth: 1, borderColor: "#CCC", padding: 6, width: 60 }}
              />
              <TextInput
                value={String(p.y)}
                placeholder="y"
                keyboardType="numeric"
                onChangeText={v => updatePoint(i, "y", v)}
                style={{ borderWidth: 1, borderColor: "#CCC", padding: 6, width: 60 }}
              />
              <TouchableOpacity onPress={() => removePoint(i)}>
                <Text style={{ color: "#D32F2F", fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={addPoint} style={{ marginTop: 6 }}>
            <Text style={{ color: "#1976D2" }}>+ Add point</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={{ marginTop: 12 }}
          >
            <Text style={{ color: "#D32F2F" }}>Delete chart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
