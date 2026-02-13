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
import { signUp } from "@/services/auth";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors } from "@/constants/Colors";

export default function SignUpScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert(t("error"), t("fillAllFields"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("error"), t("passwordMinLength"));
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(t("error"), t("acceptTerms"));
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(t("signUpFailed"), error.message);
    } else {
      Alert.alert(
        t("accountCreated"),
        t("canSignInNow"),
        [{ text: t("ok"), onPress: () => router.replace("/(auth)/sign-in") }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t("signUpTitle")}</Text>
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.tint }]}>{t("password")}</Text>
            <View style={[styles.passwordContainer, { borderBottomColor: colors.icon + "50" }]}>
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder={t("passwordPlaceholder")}
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.icon + "50" },
                agreedToTerms && { backgroundColor: colors.tint, borderColor: colors.tint },
              ]}
            >
              {agreedToTerms && (
                <Ionicons name="checkmark" size={14} color={colors.background} />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              {t("agreeTo")}{" "}
              <Text style={{ color: colors.tint, fontWeight: "500" }}>
                {t("termsOfService")}
              </Text>{" "}
              {t("and")}{" "}
              <Text style={{ color: colors.tint, fontWeight: "500" }}>
                {t("privacyPolicy")}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.tint },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {t("continue")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.icon }]}>
              {t("haveAccount")}{" "}
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
    paddingTop: 80,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: "700" },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  eyeButton: { padding: 8 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: { flex: 1, fontSize: 14, lineHeight: 20 },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
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
};
