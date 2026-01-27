import { Tabs } from "expo-router";
import { useSettings } from "@/hooks/use-settings";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const { isDark } = useSettings();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        // 🔹 HEADER
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },

        // 🔹 TAB BAR
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.icon,
        },
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,

        // 🔑 TÄMÄ KORJAA TAB-TEXTIT
        tabBarLabelStyle: {
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="calculator" />
      <Tabs.Screen name="notes" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
