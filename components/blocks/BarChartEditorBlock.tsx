import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import BarChartBlock from "./BarChartBlock";

type Bar = { label: string; value: number };

export default function BarChartEditorBlock({
  onDelete,
}: {
  onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [bars, setBars] = useState<Bar[]>([
    { label: "A", value: 3 },
    { label: "B", value: 5 },
  ]);
  
  const [title, setTitle] = useState("Bar chart");
  const [editingTitle, setEditingTitle] = useState(false);


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
                placeholder="label"
                onChangeText={v => updateBar(i, "label", v)}
                style={{ borderWidth: 1, borderColor: "#CCC", padding: 6, width: 70 }}
              />
              <TextInput
                value={String(b.value)}
                placeholder="value"
                keyboardType="numeric"
                onChangeText={v => updateBar(i, "value", v)}
                style={{ borderWidth: 1, borderColor: "#CCC", padding: 6, width: 60 }}
              />
              <TouchableOpacity onPress={() => removeBar(i)}>
                <Text style={{ color: "#D32F2F", fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity onPress={addBar} style={{ marginTop: 6 }}>
            <Text style={{ color: "#1976D2" }}>+ Add bar</Text>
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
