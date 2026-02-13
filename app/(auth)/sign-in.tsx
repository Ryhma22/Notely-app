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
import { signIn } from "@/services/auth";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { Colors } from "@/constants/Colors";

export default function SignInScreen() {
  const { isDark } = useSettings();
  const { t } = useI18n();
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(t("error"), t("fillAllFields"));
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert(t("signInFailed"), error.message);
    } else {
      router.replace("/(tabs)");
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
        <Text style={[styles.logo, { color: colors.icon }]}>Notely</Text>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t("signIn")}</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            {t("signInSubtitle")}
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
            style={[styles.button, { backgroundColor: colors.tint }, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {t("signIn")}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={[styles.forgotText, { color: colors.icon }]}>
                  {t("forgotPassword")}
                </Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={[styles.signUpText, { color: colors.tint }]}>
                  {t("signUp")}
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
  logo: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },
  header: { marginBottom: 32 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16 },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
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
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: { padding: 8 },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: "600" },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  forgotText: { fontSize: 14 },
  signUpText: { fontSize: 14, fontWeight: "600" },
};
