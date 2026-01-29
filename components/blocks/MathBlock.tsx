import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { calculateExpression } from "../MathUtils";
import { useI18n } from "@/hooks/use-i18n";

export default function MathBlock({
  onDelete,
}: {
  onDelete?: () => void;
}) {
  const { t } = useI18n();

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const calculate = () => {
    try {
      setResult(calculateExpression(expression));
    } catch {
      setResult(t("invalidExpression"));
    }
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
      {onDelete && (
        <View style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
          <TouchableOpacity onPress={() => setOpen(!open)}>
            <Text>✎</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={{ fontWeight: "600", marginBottom: 6, textAlign: "center" }}>
        {t("math")}
      </Text>

      <TextInput
        value={expression}
        onChangeText={setExpression}
        placeholder={t("mathPlaceholder")}
        style={{
          borderWidth: 1,
          borderColor: "#CCC",
          padding: 8,
          marginBottom: 8,
        }}
      />

      <TouchableOpacity
        onPress={calculate}
        style={{
          paddingVertical: 8,
          alignItems: "center",
          backgroundColor: "#1976D2",
          marginBottom: 6,
        }}
      >
        <Text style={{ color: "#FFF" }}>{t("calculate")}</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={{ textAlign: "center", marginBottom: 6 }}>
          = {result}
        </Text>
      )}

      {open && onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: "#D32F2F", marginTop: 8 }}>
            {t("deleteBlock")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
