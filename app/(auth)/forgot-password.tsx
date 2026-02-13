import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "@/services/auth";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors } from "@/constants/Colors";

export default function ForgotPasswordScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t("error"), t("enterEmail"));
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert(t("error"), error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.tint + "30",
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={48}
              color={colors.tint}
            />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            {t("checkYourEmail")}
          </Text>
          <Text style={[styles.successText, { color: colors.icon }]}>
            {t("resetLinkSent")}{"\n"}
            <Text style={[styles.emailText, { color: colors.text }]}>
              {email}
            </Text>
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => router.replace("/(auth)/sign-in")}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              {t("backToSignIn")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("forgotPasswordTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            {t("forgotPasswordSubtitle")}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.tint }]}>{t("email")}</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderBottomColor: colors.icon + "50" }]}
              placeholder={t("emailPlaceholder")}
              placeholderTextColor={colors.icon}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.tint },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {t("sendResetLink")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.icon }]}>
              {t("rememberPassword")}{" "}
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={[styles.signInLink, { color: colors.tint }]}>
                  {t("signIn")}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: "600" },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signInText: { fontSize: 14 },
  signInLink: { fontSize: 14, fontWeight: "600" },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  successText: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emailText: { fontWeight: "600" },
};
