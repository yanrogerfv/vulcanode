import { useProjectStore, Language } from '@/store/useProjectStore';

// Restrição estrutural "todo valor é string" via mapped type auto-referente: aceita
// tanto um Record<string,string> quanto uma interface com chaves nomeadas (sem index
// signature), o que uma constraint `extends Record<string,string>` direta rejeitaria.
type StringDict<D> = { [K in keyof D]: string };

/** Dicionário de um namespace de UI: um mapa de chaves para texto, um por idioma suportado. */
export type LanguageDict<D extends StringDict<D> = Record<string, string>> = {
  pt: D;
  en: D;
};

/**
 * Hook de tradução por namespace: cada componente importa seu próprio dicionário
 * (ex: `sidebarDict`) e chama `useT(sidebarDict)` para receber uma função `t(key)`
 * type-safe e reativa a troca de idioma no store.
 */
export function useT<D extends StringDict<D>>(dictionary: LanguageDict<D>) {
  const language = useProjectStore((s) => s.language);
  return (key: keyof D): string => dictionary[language][key];
}

/** Versão sem hook, para uso fora de componentes React (funções do store, utilitários). */
export function translate<D extends StringDict<D>>(dictionary: LanguageDict<D>, key: keyof D, language: Language): string {
  return dictionary[language][key];
}
