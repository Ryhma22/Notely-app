import { useSettings } from "@/hooks/use-settings";
import { translations, Language } from "@/constants/i18n";

export function useI18n() {
  const { language } = useSettings();
  const lang = (language ?? "fi") as Language;

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? key;
  };

  return { t, language: lang };
}
