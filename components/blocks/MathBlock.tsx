import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { calculateExpression } from "../MathUtils";
import { useI18n } from "@/hooks/use-i18n";
import { useSettings } from "@/hooks/use-settings";
import { Colors, DANGER_COLOR } from "@/constants/Colors";
import type { NoteBlock } from "@/lib/database.types";

export default function MathBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: NoteBlock;
  onUpdate?: (data: { expression: string; result: string | null }) => void;
  onDelete?: () => void;
}) {
  const { t } = useI18n();
  const { isDark } = useSettings();
  const colors = isDark ? Colors.dark : Colors.light;

  const initialData =
    typeof block.data === "object" && block.data !== null && !Array.isArray(block.data)
      ? block.data
      : {};

  const [expression, setExpression] = useState(
    typeof (initialData as any).expression === "string"
      ? (initialData as any).expression
      : ""
  );
  const [result, setResult] = useState<string | null>(
    typeof (initialData as any).result === "string"
      ? (initialData as any).result
      : (initialData as any).result === null
        ? null
        : null
  );
  const [open, setOpen] = useState(false);

  // Tallennetaan muutokset tietokantaan
  useEffect(() => {
    onUpdate?.({ expression, result });
  }, [expression, result]);

  const calculate = () => {
    try {
      const calcResult = calculateExpression(expression);
      setResult(calcResult);
    } catch {
      setResult(t("invalidExpression"));
    }
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
      {/* Muokkaa/Poista -painike */}
      {onDelete && (
        <View style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
          <TouchableOpacity onPress={() => setOpen(!open)}>
            <Text style={{ color: colors.icon }}>✎</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={{
          fontWeight: "600",
          marginBottom: 6,
          textAlign: "center",
          color: colors.text,
        }}
      >
        {t("math")}
      </Text>

      <TextInput
        value={expression}
        onChangeText={setExpression}
        placeholder={t("mathPlaceholder")}
        placeholderTextColor={colors.icon}
        style={{
          borderWidth: 1,
          borderColor: colors.icon + "50",
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
          color: colors.text,
        }}
      />

      <TouchableOpacity
        onPress={calculate}
        style={{
          paddingVertical: 8,
          alignItems: "center",
          backgroundColor: colors.tint,
          borderRadius: 8,
          marginBottom: 6,
        }}
      >
        <Text style={{ color: colors.background }}>{t("calculate")}</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={{ textAlign: "center", marginBottom: 6, color: colors.text }}>
          = {result}
        </Text>
      )}

      {open && onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: DANGER_COLOR, marginTop: 8 }}>
            {t("deleteBlock")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
