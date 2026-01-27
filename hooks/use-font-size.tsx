import { createContext, useContext, useState } from "react";

type FontSize = "small" | "medium" | "large";

type FontSizeContextType = {
  fontSize: FontSize;
  scale: number;
  setFontSize: (size: FontSize) => void;
};

const FontSizeContext = createContext<FontSizeContextType | null>(null);

const FONT_SCALES: Record<FontSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.15,
};

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        scale: FONT_SCALES[fontSize],
        setFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used inside FontSizeProvider");
  }
  return ctx;
}
