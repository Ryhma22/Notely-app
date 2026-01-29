import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { signOut, resetPassword, deleteAccount } from "@/services/auth";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import TextApp from "@/components/TextApp";
import { getUsedCacheMB, clearCache } from "@/utils/cache";

export default function SettingsScreen() {
  const { user } = useAuth();
  const {
    isDark,
    fontSize,
    language,
    toggleDark,
    setFontSize,
    setLanguage,
  } = useSettings();
  const { t } = useI18n();

  const [usedCacheMB, setUsedCacheMB] = useState<number>(0);

  const backgroundColor = isDark ? "#121212" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  const loadCacheSize = async () => {
    const size = await getUsedCacheMB();
    setUsedCacheMB(size);
  };

  useEffect(() => {
    loadCacheSize();
  }, []);


  const handleFontSizePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t("fontSize"),
          options: ["Small", "Normal", "Large", "Cancel"],
          cancelButtonIndex: 3,
        },
        (index) => {
          if (index === 0) setFontSize("small");
          if (index === 1) setFontSize("normal");
          if (index === 2) setFontSize("large");
        }
      );
    }
  };

  const handleDarkModePress = () => {
  if (Platform.OS !== "ios") {
    toggleDark();
    return;
  }

    ActionSheetIOS.showActionSheetWithOptions(
     {
        title: t("darkMode"),
        options: ["On", "Off", "Cancel"],
        cancelButtonIndex: 2,
     },
     (index) => {
       if (index === 0 && !isDark) toggleDark();
        if (index === 1 && isDark) toggleDark();
      }
   );
  };


  const handleLanguagePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t("language"),
          options: ["Suomi", "English", "Cancel"],
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0) setLanguage("fi");
          if (index === 1) setLanguage("en");
        }
      );
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      t("clearCache"),
      t("clearCache"),
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearCache();
            await loadCacheSize();
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      {/* USER */}
      <View style={styles.userBox}>
        <Image
          source={require("../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />
        <TextApp style={[styles.userName, { color: textColor }]}>
          {displayName}
        </TextApp>
        <TextApp style={styles.userEmail}>{user?.email}</TextApp>
      </View>

      {/* ACCOUNT */}
      <TextApp style={[styles.sectionTitle, { color: textColor }]}>
        {t("account")}
      </TextApp>
      <View style={styles.sectionBox}>
        <SettingsItem label={t("changePassword")} textColor={textColor} onPress={handleLogout} />
        <SettingsItem label={t("logout")} textColor={textColor} onPress={handleLogout} />
        <SettingsItem label={t("deleteAccount")} danger textColor={textColor} onPress={handleDeleteAccount} />
      </View>

      {/* PREFERENCES */}
      <TextApp style={[styles.sectionTitle, { color: textColor }]}>
        {t("preferences")}
      </TextApp>
      <View style={styles.sectionBox}>
        <SettingsItem
          label={`${t("language")}: ${language.toUpperCase()}`}
          textColor={textColor}
          onPress={handleLanguagePress} // 👈 POPUP
        />
        <SettingsItem
         label={`${t("darkMode")}: ${isDark ? "On" : "Off"}`}
         textColor={textColor}
         onPress={handleDarkModePress}
        />


        <SettingsItem
          label={`${t("fontSize")}: ${fontSize}`}
          textColor={textColor}
          onPress={handleFontSizePress}
        />
      </View>

      {/* STORAGE */}
      <TextApp style={[styles.sectionTitle, { color: textColor }]}>
        {t("storage")}
      </TextApp>
      <View style={styles.sectionBox}>
        <SettingsItem
          label={`${t("usedSpace")}: ${usedCacheMB} MB`}
          textColor={textColor}
        />
        <SettingsItem
          label={t("clearCache")}
          textColor={textColor}
          onPress={handleClearCache}
        />
      </View>

      {/* ABOUT */}
      <TextApp style={[styles.sectionTitle, { color: textColor }]}>
        {t("about")}
      </TextApp>
      <View style={styles.sectionBox}>
        <SettingsItem label={`${t("version")}: 1.0.0`} textColor={textColor} />
      </View>


      {/* PRO+ */}
      <TextApp style={[styles.sectionTitle, { color: textColor }]}>
       PRO+
      </TextApp>
      <View style={styles.sectionBox}>
       <SettingsItem
        label="Upgrade to Pro"
        textColor={textColor}
        onPress={() => {}}
        />
        </View>

      </ScrollView>
  );
}

function SettingsItem({
  label,
  onPress,
  danger,
  textColor,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
  textColor: string;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <TextApp
        style={[
          styles.itemText,
          { color: textColor },
          danger && { color: "#D32F2F" },
        ]}
      >
        {label}
      </TextApp>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  userBox: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 8 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14, color: "#666" },
  sectionTitle: { fontWeight: "600", marginTop: 16, marginBottom: 6 },
  sectionBox: { borderWidth: 1, borderColor: "#DDD" },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  itemText: {},
});
