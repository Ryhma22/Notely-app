import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { calculateExpression } from "../../components/MathUtils";

export default function CalculatorScreen() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    try {
      const value = calculateExpression(expression);
      setResult(value);
      setError(null);
    } catch {
      setResult(null);
      setError("Invalid expression");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor:"white" }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Calculator
      </Text>

      <TextInput
        value={expression}
        onChangeText={setExpression}
        placeholder="e.g. (2+3)*5"
        style={{
          borderWidth: 1,
          borderColor: "#CCC",
          padding: 12,
          fontSize: 16,
          marginBottom: 12,
        }}
      />

      <TouchableOpacity
        onPress={calculate}
        style={{
          backgroundColor: "#1976D2",
          padding: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 18 }}>=</Text>
      </TouchableOpacity>

      {result !== null && (
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          Result: <Text style={{ fontWeight: "bold" }}>{result}</Text>
        </Text>
      )}

      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>
          {error}
        </Text>
      )}
    </View>
  );
}
