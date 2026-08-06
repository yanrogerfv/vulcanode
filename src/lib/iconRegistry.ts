import { useEffect, useSyncExternalStore } from 'react';
import type { ComponentType, SVGProps } from 'react';

// Props de SVG completas: além de className/style, o minimapa precisa passar
// x/y/width/height para posicionar o ícone dentro do seu próprio espaço de coordenadas.
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Catálogo completo de ícones da Lucide (~4000).
 *
 * Ele é carregado sob demanda com `import()` de propósito: um `import * as` estático
 * anularia o tree-shaking e jogaria a biblioteca inteira no bundle principal. Assim,
 * o carregamento acontece num chunk separado disparado no primeiro uso do hook —
 * ou seja, já na montagem do board — sem pesar no carregamento inicial da página.
 */
let catalog: Record<string, IconComponent> | null = null;
let loadPromise: Promise<Record<string, IconComponent>> | null = null;
const listeners = new Set<() => void>();

// A Lucide exporta cada ícone várias vezes: o nome canônico ("Sword"), o sufixado
// ("SwordIcon") e o alias legado ("LucideSword"). Mantemos só o canônico para a grade
// não vir triplicada. O único `Lucide*` sem equivalente é o `LucideProvider`, que não
// é um ícone, então descartá-lo também é o comportamento correto.
function isIconExport(key: string): boolean {
  if (!/^[A-Z]/.test(key)) return false;
  if (key === 'Icon' || key.endsWith('Icon')) return false;
  if (/^Lucide[A-Z]/.test(key)) return false;
  return true;
}

export function loadIconCatalog(): Promise<Record<string, IconComponent>> {
  if (loadPromise) return loadPromise;

  loadPromise = import('lucide-react').then((mod) => {
    const loaded: Record<string, IconComponent> = {};
    const source = mod as unknown as Record<string, unknown>;

    Object.keys(source).forEach((key) => {
      if (!isIconExport(key)) return;
      const value = source[key];
      if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
        loaded[key] = value as IconComponent;
      }
    });

    catalog = loaded;
    listeners.forEach((notify) => notify());
    return loaded;
  });

  return loadPromise;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Record<string, IconComponent> | null {
  return catalog;
}

function getServerSnapshot(): Record<string, IconComponent> | null {
  return null;
}

/** Devolve o catálogo já carregado (ou null enquanto o chunk não chega) e dispara o carregamento. */
export function useIconCatalog(): Record<string, IconComponent> | null {
  useEffect(() => {
    loadIconCatalog();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
