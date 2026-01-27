import { createContext, useContext, useEffect, useState } from "react";
import { getUserSettings, updateUserSettings } from "@/services/settings";

export type FontSize = "small" | "normal" | "large";

type SettingsContextType = {
  isDark: boolean;
  fontSize: FontSize;
  language: string;
  toggleDark: () => Promise<void>;
  setFontSize: (size: FontSize) => Promise<void>;
  setLanguage: (lang: string) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  isDark: false,
  fontSize: "normal",
  language: "fi",
  toggleDark: async () => {},
  setFontSize: async () => {},
  setLanguage: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [language, setLanguageState] = useState("fi");

  useEffect(() => {
    (async () => {
      const { data } = await getUserSettings();
      if (!data) return;

      setIsDark(data.dark_mode ?? false);

      // 🔒 Safe font size mapping
      const size =
        data.font_size === "small" ||
        data.font_size === "large" ||
        data.font_size === "normal"
          ? data.font_size
          : "normal";

      setFontSizeState(size);
      setLanguageState(data.language ?? "fi");
    })();
  }, []);

  const toggleDark = async () => {
    const next = !isDark;
    setIsDark(next);
    await updateUserSettings({ dark_mode: next });
  };

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    await updateUserSettings({ font_size: size });
  };

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    await updateUserSettings({ language: lang });
  };

  return (
    <SettingsContext.Provider
      value={{
        isDark,
        fontSize,
        language,
        toggleDark,
        setFontSize,
        setLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
