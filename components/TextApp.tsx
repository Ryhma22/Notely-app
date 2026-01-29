import { Text, TextProps } from "react-native";
import { useSettings } from "@/hooks/use-settings";
import { Colors } from "@/constants/Colors";

export default function TextApp({ style, ...props }: TextProps) {
  const { fontSize, isDark } = useSettings();
  const colors = isDark ? Colors.dark : Colors.light;

  const baseSize =
    fontSize === "small" ? 14 :
    fontSize === "large" ? 18 :
    16; // normal

  return (
    <Text
      {...props}
      style={[
        {
          fontSize: baseSize,
          color: colors.text, // 🔑 TÄMÄ KORJAA MUSTAN TEKSTIN
        },
        style,
      ]}
    />
  );
}
