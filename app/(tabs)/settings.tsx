import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { signOut, resetPassword, deleteAccount } from "@/services/auth";
import { getUserSettings, updateUserSettings } from "@/services/settings";
import { getProfile, updateProfile } from "@/services/profile";
import type { UserSettings, Profile } from "@/lib/database.types";

export default function SettingsScreen() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Haetaan tietokannasta
  const isDark = settings?.dark_mode ?? false;
  const backgroundColor = isDark ? "#121212" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  // Lataa asetukset ja profiili
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const [settingsResult, profileResult] = await Promise.all([
      getUserSettings(),
      getProfile(),
    ]);
    setSettings(settingsResult.data);
    setProfile(profileResult.data);
    setLoading(false);
  };

  const handleToggleDarkMode = async () => {
    const newValue = !isDark;
    // Päivitä UI heti
    setSettings(settings ? { ...settings, dark_mode: newValue } : null);
    // Tallenna tietokantaan
    await updateUserSettings({ dark_mode: newValue });
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      Alert.alert("Virhe", "Sähköpostia ei löydy");
      return;
    }

    Alert.alert(
      "Vaihda salasana",
      `Lähetämme salasanan vaihtolinkin osoitteeseen ${user.email}`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Lähetä",
          onPress: async () => {
            const { error } = await resetPassword(user.email!);
            if (error) {
              Alert.alert("Virhe", error.message);
            } else {
              Alert.alert("Lähetetty!", "Tarkista sähköpostisi salasanan vaihtolinkki.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      "Kirjaudu ulos",
      "Haluatko varmasti kirjautua ulos?",
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Kirjaudu ulos",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Poista tili",
      "Oletko varma? Tätä toimintoa ei voi peruuttaa. Kaikki tietosi poistetaan pysyvästi.",
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista tili",
          style: "destructive",
          onPress: async () => {
            const { error } = await deleteAccount();
            if (error) {
              Alert.alert("Virhe", error.message);
            } else {
              await signOut();
              router.replace("/(auth)/sign-in");
              Alert.alert("Tili poistettu", "Tilisi on poistettu onnistuneesti.");
            }
          },
        },
      ]
    );
  };

  // Käytä profiilista nimeä tai fallback sähköpostiin
  const displayName = profile?.full_name || 
                      user?.user_metadata?.full_name || 
                      user?.email?.split("@")[0] || 
                      "Käyttäjä";

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.userBox}>
        <Image
          source={require("../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />
        <Text style={[styles.userName, { color: textColor }]}>{displayName}</Text>
        <Text style={styles.userEmail}>{user?.email || ""}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Change password" textColor={textColor} onPress={handleChangePassword} />
        <SettingsItem label="Log out" textColor={textColor} onPress={handleLogout} />
        <SettingsItem label="Delete account" danger textColor={textColor} onPress={handleDeleteAccount} />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Preferences</Text>
      <View style={styles.sectionBox}>
        <SettingsItem 
          label={`Language: ${settings?.language || 'fi'}`} 
          textColor={textColor} 
        />
        <SettingsItem
          label={`Dark mode: ${isDark ? "On" : "Off"}`}
          onPress={handleToggleDarkMode}
          textColor={textColor}
        />
        <SettingsItem 
          label={`Font size: ${settings?.font_size || 'medium'}`} 
          textColor={textColor} 
        />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Storage</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Used space" textColor={textColor} />
        <SettingsItem label="Clear cache" textColor={textColor} />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Calculator</Text>
      <View style={styles.sectionBox}>
        <SettingsItem 
          label={`Precision: ${settings?.calculator_precision || 10}`} 
          textColor={textColor} 
        />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Version: 1.0.0" textColor={textColor} />
        <SettingsItem label="Privacy policy" textColor={textColor} />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>PRO+</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Upgrade to Pro" pro textColor={textColor} />
      </View>
    </ScrollView>
  );
}

function SettingsItem({
  label,
  danger,
  pro,
  onPress,
  textColor,
}: {
  label: string;
  danger?: boolean;
  pro?: boolean;
  onPress?: () => void;
  textColor: string;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text
        style={[
          styles.itemText,
          { color: textColor },
          danger && { color: "#D32F2F" },
          pro && { fontWeight: "bold" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  userBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#555555",
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  itemText: {
    fontSize: 16,
  },
});
