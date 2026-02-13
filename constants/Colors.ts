import { Platform } from "react-native";

// Brändiväri – käytetään auth-sivuilla ja accent-elementeissä
export const BRAND_TINT = "#0a7ea4";

// Varoitus- ja poisto-toiminnot
export const DANGER_COLOR = "#D32F2F";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#ffffff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ffffff",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});
