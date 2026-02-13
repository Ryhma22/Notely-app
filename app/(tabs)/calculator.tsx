import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateExpression } from "../../components/MathUtils";
import { fetchRates, convert, CURRENCY_CODES } from "@/services/currency";
import type { CurrencyCode } from "@/services/currency";
import { useSettings } from "@/hooks/use-settings";
import { Colors, DANGER_COLOR } from "@/constants/Colors";
import TextApp from "@/components/TextApp";
import { useI18n } from "@/hooks/use-i18n";

const PRECISION_OPTIONS = [0, 2, 4, 6, 8];

export default function CalculatorScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [precision, setPrecision] = useState(6);

  // Valuutanmuunnos
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("EUR");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD");
  const [currencyResult, setCurrencyResult] = useState<string | null>(null);
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    fetchRates()
      .then((data) => {
        setRates(data.rates);
      })
      .catch(() => {
        setCurrencyError(t("currencyError"));
      })
      .finally(() => {
        setRatesLoading(false);
      });
  }, []);

  const calculate = () => {
    try {
      setResult(calculateExpression(expression, precision));
      setError(null);
    } catch {
      setResult(null);
      setError(t("invalidExpression"));
    }
  };

  const handleConvert = () => {
    setCurrencyError(null);
    setCurrencyResult(null);

    const num = parseFloat(amount.replace(",", "."));
    if (isNaN(num) || num <= 0) {
      setCurrencyError(t("enterAmount"));
      return;
    }

    if (!rates) {
      setCurrencyError(t("currencyError"));
      return;
    }

    try {
      const converted = convert(num, fromCurrency, toCurrency, rates);
      setCurrencyResult(`${num} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`);
    } catch {
      setCurrencyError(t("currencyError"));
    }
  };

  const showCurrencyPicker = (
    title: string,
    onSelect: (code: CurrencyCode) => void
  ) => {
    Alert.alert(
      title,
      "",
      [
        ...CURRENCY_CODES.map((code) => ({
          text: code,
          onPress: () => onSelect(code),
        })),
        { text: t("cancel"), style: "cancel" },
      ]
    );
  };

  const pageBg = isDark ? "#0D0E0F" : "#F2F3F5";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: pageBg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Laskin */}
        <View
          style={[
            styles.displayCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.icon + "30",
              ...(Platform.OS === "android"
                ? { elevation: 2 }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.2 : 0.08,
                    shadowRadius: 8,
                  }),
            },
          ]}
        >
          <TextInput
            value={expression}
            onChangeText={(text) => {
              setExpression(text);
              setError(null);
            }}
            placeholder={t("calculatorPlaceholder")}
            placeholderTextColor={colors.icon}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
            onSubmitEditing={calculate}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
          />

          <View style={styles.resultArea}>
            {result !== null && (
              <TextApp
                style={[styles.resultText, { color: colors.tint }]}
                numberOfLines={2}
              >
                = {result}
              </TextApp>
            )}
            {error && (
              <TextApp
                style={[styles.errorText, { color: DANGER_COLOR }]}
                numberOfLines={2}
              >
                {error}
              </TextApp>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={calculate}
          activeOpacity={0.8}
          style={[
            styles.calculateButton,
            {
              backgroundColor: colors.tint,
              ...(Platform.OS === "android"
                ? { elevation: 2 }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }),
            },
          ]}
        >
          <Ionicons
            name="calculator"
            size={24}
            color={colors.background}
            style={{ marginRight: 8 }}
          />
          <TextApp style={[styles.calculateText, { color: colors.background }]}>
            {t("calculate")}
          </TextApp>
        </TouchableOpacity>

        {/* Tarkkuus */}
        <View style={styles.precisionSection}>
          <TextApp style={[styles.precisionLabel, { color: colors.icon }]}>
            {t("precision")}
          </TextApp>
          <View style={styles.precisionRow}>
            {PRECISION_OPTIONS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPrecision(p)}
                style={[
                  styles.precisionChip,
                  {
                    backgroundColor:
                      precision === p ? colors.tint : colors.background,
                    borderColor:
                      precision === p ? colors.tint : colors.icon + "40",
                  },
                ]}
              >
                <TextApp
                  style={[
                    styles.precisionChipText,
                    {
                      color: precision === p ? colors.background : colors.text,
                    },
                  ]}
                >
                  {p} {t("decimals")}
                </TextApp>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Valuutanmuunnos */}
        <View
          style={[
            styles.currencyCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.icon + "30",
              ...(Platform.OS === "android"
                ? { elevation: 2 }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.2 : 0.08,
                    shadowRadius: 8,
                  }),
            },
          ]}
        >
          <TextApp style={[styles.currencyTitle, { color: colors.text }]}>
            {t("currencyConvert")}
          </TextApp>

          <TextApp style={[styles.currencyLabel, { color: colors.icon }]}>
            {t("amount")}
          </TextApp>
          <TextInput
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setCurrencyResult(null);
              setCurrencyError(null);
            }}
            placeholder="0"
            placeholderTextColor={colors.icon}
            keyboardType="decimal-pad"
            style={[
              styles.currencyInput,
              {
                color: colors.text,
                borderColor: colors.icon + "40",
              },
            ]}
          />

          <View style={styles.currencyRow}>
            <TouchableOpacity
              onPress={() => showCurrencyPicker(t("from"), setFromCurrency)}
              style={[
                styles.currencySelector,
                { borderColor: colors.icon + "40", backgroundColor: colors.background },
              ]}
            >
              <TextApp style={{ color: colors.text }}>{t("from")}</TextApp>
              <TextApp style={[styles.currencyCode, { color: colors.tint }]}>
                {fromCurrency}
              </TextApp>
            </TouchableOpacity>

            <Ionicons
              name="arrow-forward"
              size={20}
              color={colors.icon}
              style={{ marginHorizontal: 8 }}
            />

            <TouchableOpacity
              onPress={() => showCurrencyPicker(t("to"), setToCurrency)}
              style={[
                styles.currencySelector,
                { borderColor: colors.icon + "40", backgroundColor: colors.background },
              ]}
            >
              <TextApp style={{ color: colors.text }}>{t("to")}</TextApp>
              <TextApp style={[styles.currencyCode, { color: colors.tint }]}>
                {toCurrency}
              </TextApp>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleConvert}
            disabled={ratesLoading}
            style={[
              styles.convertButton,
              {
                backgroundColor: ratesLoading ? colors.icon + "50" : colors.tint,
              },
            ]}
          >
            <Ionicons
              name="swap-horizontal"
              size={20}
              color={colors.background}
              style={{ marginRight: 8 }}
            />
            <TextApp style={{ color: colors.background, fontWeight: "600" }}>
              {t("convert")}
            </TextApp>
          </TouchableOpacity>

          {currencyResult && (
            <TextApp
              style={[styles.currencyResult, { color: colors.tint }]}
              numberOfLines={1}
            >
              {currencyResult}
            </TextApp>
          )}
          {currencyError && (
            <TextApp style={[styles.currencyError, { color: DANGER_COLOR }]}>
              {currencyError}
            </TextApp>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  displayCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 16,
  },
  resultArea: {
    minHeight: 36,
    justifyContent: "center",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  calculateText: {
    fontSize: 18,
    fontWeight: "600",
  },
  precisionSection: {
    marginBottom: 24,
  },
  precisionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  precisionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  precisionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  precisionChipText: {
    fontSize: 13,
  },
  currencyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  currencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  currencyLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  currencyInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    marginBottom: 16,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currencySelector: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  convertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  currencyResult: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  currencyError: {
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
};
