import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type Density = "comfortable" | "compact";
type Lang = "en" | "fr" | "ar";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", clients: "Clients", projects: "Projects", tasks: "Tasks", settings: "Settings",
    welcome: "Welcome back to ClientArc 👋",
    save: "Save Changes", saved: "✓ Saved",
    appearance: "Appearance", workflow: "Workflow Defaults", notifications: "Notifications",
    payments: "Payment Methods", integrations: "Integrations", data: "Data & Privacy",
  },
  fr: {
    dashboard: "Tableau de bord", clients: "Clients", projects: "Projets", tasks: "Tâches", settings: "Paramètres",
    welcome: "Bienvenue sur ClientArc 👋",
    save: "Enregistrer", saved: "✓ Enregistré",
    appearance: "Apparence", workflow: "Flux de travail", notifications: "Notifications",
    payments: "Moyens de paiement", integrations: "Intégrations", data: "Données & Confidentialité",
  },
  ar: {
    dashboard: "لوحة التحكم", clients: "العملاء", projects: "المشاريع", tasks: "المهام", settings: "الإعدادات",
    welcome: "مرحباً بعودتك إلى ClientArc 👋",
    save: "حفظ التغييرات", saved: "✓ تم الحفظ",
    appearance: "المظهر", workflow: "إعدادات سير العمل", notifications: "الإشعارات",
    payments: "طرق الدفع", integrations: "التكاملات", data: "البيانات والخصوصية",
  },
};

interface Ctx {
  theme: Theme; setTheme: (t: Theme) => void;
  density: Density; setDensity: (d: Density) => void;
  lang: Lang; setLang: (l: Lang) => void;
  t: (k: string) => string;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(() => (localStorage.getItem("fh_theme") as Theme) || "system");
  const [density, setDensityRaw] = useState<Density>(() => (localStorage.getItem("fh_density") as Density) || "comfortable");
  const [lang, setLangRaw] = useState<Lang>(() => (localStorage.getItem("fh_lang") as Lang) || "en");

  function applyTheme(th: Theme) {
    const root = document.documentElement;
    // resolve system
    const resolved = th === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : th;
    root.setAttribute("data-theme", resolved);
    root.setAttribute("data-density", density);
    // dir for arabic
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
  }

  useEffect(() => { applyTheme(theme); }, [theme, density, lang]);
  useEffect(() => {
    // listen to system changes if theme=system
    if (theme !== "system") return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => applyTheme("system");
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, [theme]);

  function setTheme(t: Theme) { localStorage.setItem("fh_theme", t); setThemeRaw(t); }
  function setDensity(d: Density) { localStorage.setItem("fh_density", d); setDensityRaw(d); }
  function setLang(l: Lang) { localStorage.setItem("fh_lang", l); setLangRaw(l); }
  function t(k: string) { return translations[lang][k] ?? translations.en[k] ?? k; }

  return <SettingsContext.Provider value={{ theme, setTheme, density, setDensity, lang, setLang, t }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const c = useContext(SettingsContext);
  if (!c) throw new Error("useSettings must be inside SettingsProvider");
  return c;
}
