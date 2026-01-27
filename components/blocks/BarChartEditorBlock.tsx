import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import BarChartBlock from "./BarChartBlock";
import { useI18n } from "@/hooks/use-i18n";

type Bar = { label: string; value: number };

export default function BarChartEditorBlock({
  onDelete,
}: {
  onDelete?: () => void;
}) {
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [bars, setBars] = useState<Bar[]>([
    { label: "A", value: 3 },
    { label: "B", value: 5 },
  ]);

  const [title, setTitle] = useState(t("barChart"));
  const [editingTitle, setEditingTitle] = useState(false);

  const updateBar = (i: number, key: "label" | "value", v: string) => {
    const next = [...bars];
    next[i] = { ...next[i], [key]: key === "value" ? Number(v) : v };
    setBars(next);
  };

  return (
    <View style={{ borderWidth: 1, borderColor: "#DDD", padding: 12 }}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text>✎</Text>
      </TouchableOpacity>

      {editingTitle ? (
        <TextInput value={title} onChangeText={setTitle} />
      ) : (
        <TouchableOpacity onPress={() => setEditingTitle(true)}>
          <Text style={{ fontWeight: "600" }}>{title}</Text>
        </TouchableOpacity>
      )}

      <BarChartBlock data={bars} />

      {open && (
        <>
          {bars.map((b, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 6 }}>
              <TextInput
                placeholder={t("label")}
                value={b.label}
                onChangeText={(v) => updateBar(i, "label", v)}
              />
              <TextInput
                placeholder={t("value")}
                value={String(b.value)}
                keyboardType="numeric"
                onChangeText={(v) => updateBar(i, "value", v)}
              />
            </View>
          ))}

          <TouchableOpacity onPress={() => setBars([...bars, { label: "", value: 0 }])}>
            <Text>{t("addBar")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Text style={{ color: "#D32F2F" }}>{t("deleteChart")}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
