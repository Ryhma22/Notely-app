export type Language = "fi" | "en";

export const translations: Record<Language, Record<string, string>> = {
  fi: {
    /* === SECTIONS === */
    account: "Tili",
    preferences: "Asetukset",
    storage: "Tallennustila",
    calculator: "Laskin",
    notes: "Muistiinpanot",
    about: "Tietoja",
    pro: "PRO+",

    /* === ACCOUNT === */
    changePassword: "Vaihda salasana",
    logout: "Kirjaudu ulos",
    deleteAccount: "Poista tili",

    /* === PREFERENCES === */
    language: "Kieli",
    darkMode: "Tumma tila",
    fontSize: "Tekstin koko",

    /* === STORAGE === */
    usedSpace: "Käytetty tila",
    clearCache: "Tyhjennä välimuisti",

    /* === CALCULATOR === */
    precision: "Tarkkuus",
    calculate: "Laske",
    invalidExpression: "Virheellinen lauseke",

    /* === GENERAL === */
    version: "Versio",
    upgrade: "Päivitä Pro-versioon",
    back: "Takaisin",
    cancel: "Peruuta",

    /* === NOTES === */
    addNote: "Lisää muistiinpano",
    deleteNote: "Poista muistiinpano",
    loadingNotes: "Ladataan muistiinpanoja…",
    writeNote: "Kirjoita muistiinpano…",

    /* === MATH BLOCK === */
    math: "Matematiikka",
    mathPlaceholder: "2+3*5",
    deleteBlock: "Poista lohko",
    calculatorPlaceholder: "esim. (2+3)*5",


    /* === BAR CHART === */
    barChart: "Pylväsdiagrammi",
    addBar: "Lisää pylväs",
    deleteChart: "Poista kaavio",
    label: "Nimi",
    value: "Arvo",

    /* === DIAGRAM === */
    addImage:"Lisää kuva",
    diagram: "Diagrammi",
    addPoint: "Lisää piste",
    trend: "Trendi",
    straight: "Suora",
    wave: "Aalto",
    x: "x",
    y: "y",
  },

  en: {
    /* === SECTIONS === */
    account: "Account",
    preferences: "Preferences",
    storage: "Storage",
    calculator: "Calculator",
    notes: "Notes",
    about: "About",
    pro: "PRO+",

    /* === ACCOUNT === */
    changePassword: "Change password",
    logout: "Log out",
    deleteAccount: "Delete account",

    /* === PREFERENCES === */
    language: "Language",
    darkMode: "Dark mode",
    fontSize: "Font size",

    /* === STORAGE === */
    usedSpace: "Used space",
    clearCache: "Clear cache",

    /* === CALCULATOR === */
    precision: "Precision",
    calculate: "Calculate",
    invalidExpression: "Invalid expression",

    /* === GENERAL === */
    version: "Version",
    upgrade: "Upgrade to Pro",
    back: "Back",
    cancel: "Cancel",

    /* === NOTES === */
    addNote: "Add note",
    deleteNote: "Delete note",
    loadingNotes: "Loading notes…",
    writeNote: "Write your note…",

    /* === MATH BLOCK === */
    math: "Math",
    mathPlaceholder: "2+3*5",
    deleteBlock: "Delete block",
    calculatorPlaceholder: "(2+3)*5",


    /* === BAR CHART === */
    addImage:"Add image",
    barChart: "Bar chart",
    addBar: "Add bar",
    deleteChart: "Delete chart",
    label: "Label",
    value: "Value",

    /* === DIAGRAM === */
    diagram: "Diagram",
    addPoint: "Add point",
    trend: "Trend",
    straight: "Straight",
    wave: "Wave",
    x: "x",
    y: "y",
  },
};
