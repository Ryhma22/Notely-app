import { Stack } from "expo-router";
import { useSettings } from "@/hooks/use-settings";
import { Colors } from "@/constants/Colors";

export default function AuthLayout() {
  const { isDark } = useSettings();
  const bg = isDark ? Colors.dark.background : Colors.light.background;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
