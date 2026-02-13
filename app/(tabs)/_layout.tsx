import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.icon,
        },
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: { color: colors.text },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="calculator"
        options={{
          title: t("calculator"),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "calculator" : "calculator-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: t("notes"),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
