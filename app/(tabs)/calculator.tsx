import { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { calculateExpression } from "../../components/MathUtils";
import { useSettings } from "@/hooks/use-settings";
import { Colors } from "@/constants/Colors";
import TextApp from "@/components/TextApp";
import { useI18n } from "@/hooks/use-i18n";

export default function CalculatorScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    try {
      setResult(calculateExpression(expression));
      setError(null);
    } catch {
      setResult(null);
      setError(t("invalidExpression"));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <TextApp
        style={{
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {t("calculator")}
      </TextApp>

      <TextInput
        value={expression}
        onChangeText={setExpression}
        placeholder={t("calculatorPlaceholder")}
        placeholderTextColor={colors.icon}
        style={{
          borderWidth: 1,
          borderColor: colors.icon,
          padding: 12,
          fontSize: 16,
          color: colors.text,
          marginBottom: 12,
        }}
      />

      <TouchableOpacity
        onPress={calculate}
        style={{
          backgroundColor: colors.tint,
          padding: 12,
          alignItems: "center",
        }}
      >
        <TextApp style={{ color: colors.background, fontSize: 18 }}>
          =
        </TextApp>
      </TouchableOpacity>

      {result && (
        <TextApp style={{ textAlign: "center", marginTop: 12 }}>
          {t("result")}: {result}
        </TextApp>
      )}

      {error && (
        <TextApp style={{ color: "red", textAlign: "center" }}>
          {error}
        </TextApp>
      )}
    </View>
  );
}
