"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "id" | "en";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (id: string, en: string) => string;
}>({ lang: "id", setLang: () => {}, t: (id) => id });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    const saved = window.localStorage.getItem("anamneon-lang");
    if (saved === "en" || saved === "id") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem("anamneon-lang", l);
    document.documentElement.lang = l;
  }

  const t = (id: string, en: string) => (lang === "id" ? id : en);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
