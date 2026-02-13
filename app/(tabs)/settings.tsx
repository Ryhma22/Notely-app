import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/hooks/use-auth";
import { signOut, deleteAccount } from "@/services/auth";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import TextApp from "@/components/TextApp";
import { getUsedCacheMB, clearCache } from "@/utils/cache";
import { Colors, DANGER_COLOR } from "@/constants/Colors";

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
  const colors = isDark ? Colors.dark : Colors.light;

  const [usedCacheMB, setUsedCacheMB] = useState<number>(0);

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
          options: [
            t("fontSizeSmall"),
            t("fontSizeNormal"),
            t("fontSizeLarge"),
            t("cancel"),
          ],
          cancelButtonIndex: 3,
        },
        (index) => {
          if (index === 0) setFontSize("small");
          if (index === 1) setFontSize("normal");
          if (index === 2) setFontSize("large");
        }
      );
    } else {
      Alert.alert(t("fontSize"), "", [
        { text: t("fontSizeSmall"), onPress: () => setFontSize("small") },
        { text: t("fontSizeNormal"), onPress: () => setFontSize("normal") },
        { text: t("fontSizeLarge"), onPress: () => setFontSize("large") },
        { text: t("cancel"), style: "cancel" },
      ]);
    }
  };

  const handleDarkModePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t("darkMode"),
          options: [t("on"), t("off"), t("cancel")],
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0 && !isDark) toggleDark();
          if (index === 1 && isDark) toggleDark();
        }
      );
    } else {
      Alert.alert(t("darkMode"), "", [
        { text: t("on"), onPress: () => !isDark && toggleDark() },
        { text: t("off"), onPress: () => isDark && toggleDark() },
        { text: t("cancel"), style: "cancel" },
      ]);
    }
  };

  const handleLanguagePress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t("language"),
          options: [t("langFi"), t("langEn"), t("cancel")],
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0) setLanguage("fi");
          if (index === 1) setLanguage("en");
        }
      );
    } else {
      Alert.alert(t("language"), "", [
        { text: t("langFi"), onPress: () => setLanguage("fi") },
        { text: t("langEn"), onPress: () => setLanguage("en") },
        { text: t("cancel"), style: "cancel" },
      ]);
    }
  };

  const handleChangePassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleClearCache = async () => {
    Alert.alert(t("clearCache"), t("clearCacheConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await clearCache();
          await loadCacheSize();
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(t("deleteAccount"), t("areYouSure"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteAccount();
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    t("user");

  const pageBackground = isDark ? "#0D0E0F" : "#F2F3F5";

  const sectionCardStyle = {
    backgroundColor: colors.background,
    borderColor: colors.icon + "30",
    ...(Platform.OS === "android"
      ? { elevation: 1 }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.2 : 0.06,
          shadowRadius: 4,
        }),
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: pageBackground }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profiilikortti */}
      <View style={[styles.profileCard, sectionCardStyle]}>
        <Image
          source={require("../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />
        <TextApp style={[styles.userName, { color: colors.text }]}>
          {displayName}
        </TextApp>
        <TextApp style={[styles.userEmail, { color: colors.icon }]}>
          {user?.email}
        </TextApp>
      </View>

      {/* Tili */}
      <TextApp style={[styles.sectionTitle, { color: colors.icon }]}>
        {t("account").toUpperCase()}
      </TextApp>
      <View style={[styles.sectionCard, sectionCardStyle]}>
        <SettingsItem
          label={t("changePassword")}
          icon="key-outline"
          onPress={handleChangePassword}
          colors={colors}
          showChevron
          isLast={false}
        />
        <SettingsItem
          label={t("logout")}
          icon="log-out-outline"
          onPress={handleLogout}
          colors={colors}
          showChevron
          isLast={false}
        />
        <SettingsItem
          label={t("deleteAccount")}
          icon="trash-outline"
          danger
          onPress={handleDeleteAccount}
          colors={colors}
          isLast
        />
      </View>

      {/* Asetukset */}
      <TextApp style={[styles.sectionTitle, { color: colors.icon }]}>
        {t("preferences").toUpperCase()}
      </TextApp>
      <View style={[styles.sectionCard, sectionCardStyle]}>
        <SettingsItem
          label={t("language")}
          value={language === "fi" ? t("langFi") : t("langEn")}
          icon="language-outline"
          onPress={handleLanguagePress}
          colors={colors}
          showChevron
          isLast={false}
        />
        <SettingsItem
          label={t("darkMode")}
          value={isDark ? t("on") : t("off")}
          icon="moon-outline"
          onPress={handleDarkModePress}
          colors={colors}
          showChevron
          isLast={false}
        />
        <SettingsItem
          label={t("fontSize")}
          value={fontSize}
          icon="text-outline"
          onPress={handleFontSizePress}
          colors={colors}
          showChevron
          isLast
        />
      </View>

      {/* Tallennustila */}
      <TextApp style={[styles.sectionTitle, { color: colors.icon }]}>
        {t("storage").toUpperCase()}
      </TextApp>
      <View style={[styles.sectionCard, sectionCardStyle]}>
        <SettingsItem
          label={t("usedSpace")}
          value={`${usedCacheMB} MB`}
          icon="server-outline"
          colors={colors}
          isLast={false}
        />
        <SettingsItem
          label={t("clearCache")}
          icon="trash-outline"
          onPress={handleClearCache}
          colors={colors}
          showChevron
          isLast
        />
      </View>

      {/* Tietoja */}
      <TextApp style={[styles.sectionTitle, { color: colors.icon }]}>
        {t("about").toUpperCase()}
      </TextApp>
      <View style={[styles.sectionCard, sectionCardStyle]}>
        <SettingsItem
          label={t("version")}
          value="1.0.0"
          icon="information-circle-outline"
          colors={colors}
          isLast
        />
      </View>

      {/* PRO+ placeholder */}
      <TextApp style={[styles.sectionTitle, { color: colors.icon }]}>
        {t("pro").toUpperCase()}
      </TextApp>
      <View style={[styles.sectionCard, sectionCardStyle]}>
        <SettingsItem
          label={t("upgrade")}
          icon="star-outline"
          onPress={() => {}}
          colors={colors}
          showChevron
          isLast
        />
      </View>
    </ScrollView>
  );
}

function SettingsItem({
  label,
  value,
  icon,
  onPress,
  danger,
  colors,
  showChevron,
  isLast = false,
}: {
  label: string;
  value?: string;
  icon?: string;
  onPress?: () => void;
  danger?: boolean;
  colors: { text: string; icon: string };
  showChevron?: boolean;
  isLast?: boolean;
}) {
  const isPressable = !!onPress;

  return (
    <TouchableOpacity
      style={[
        styles.item,
        { borderBottomColor: colors.icon + "20" },
        isLast && styles.itemLast,
      ]}
      onPress={onPress}
      disabled={!isPressable}
      activeOpacity={isPressable ? 0.6 : 1}
    >
      <View style={styles.itemLeft}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={danger ? DANGER_COLOR : colors.icon}
            style={styles.itemIcon}
          />
        )}
        <TextApp
          style={[
            styles.itemLabel,
            { color: danger ? DANGER_COLOR : colors.text },
          ]}
        >
          {label}
        </TextApp>
      </View>
      {(value !== undefined || showChevron) && (
        <View style={styles.itemRight}>
          {value !== undefined && (
            <TextApp style={[styles.itemValue, { color: colors.icon }]}>
              {value}
            </TextApp>
          )}
          {showChevron && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.icon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemValue: {
    fontSize: 14,
  },
});
