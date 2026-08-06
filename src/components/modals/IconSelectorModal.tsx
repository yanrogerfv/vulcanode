import React, { useState, useMemo } from 'react';
import { Search, X, LoaderCircle, Ban } from 'lucide-react';
import { useIconCatalog } from '@/lib/iconRegistry';
import { useProjectStore } from '@/store/useProjectStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useT } from '@/lib/i18n/useT';
import { editModalDict } from '@/lib/i18n/dictionaries/editModal';

// A Lucide tem ~4000 ícones; renderizar todos de uma vez trava a grade.
// Mostramos uma fatia e deixamos a busca fazer o resto do trabalho.
const MAX_VISIBLE = 300;

export const RenderLucideIcon: React.FC<{ name?: string; className?: string; style?: React.CSSProperties }> = ({
  name = '',
  className = 'w-5 h-5',
  style
}) => {
  const catalog = useIconCatalog();
  if (!name) return null;

  const IconComponent = catalog?.[name];
  if (!IconComponent) return null;

  return <IconComponent className={className} style={style} />;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
}

export const IconSelectorModal: React.FC<Props> = ({ isOpen, onClose, selectedIcon, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const catalog = useIconCatalog();
  const t = useT(editModalDict);
  const language = useProjectStore((s) => s.language);
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';

  const allNames = useMemo(() => (catalog ? Object.keys(catalog) : []), [catalog]);

  const matches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allNames;
    return allNames.filter((name) => name.toLowerCase().includes(term));
  }, [allNames, searchTerm]);

  const visible = matches.slice(0, MAX_VISIBLE);
  const hiddenCount = matches.length - visible.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-5 bg-card border-border rounded-2xl w-[92vw] max-w-lg sm:max-w-lg md:max-w-lg max-h-[80vh] flex flex-col shadow-2xl font-sans z-[100] gap-0">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-base font-semibold text-foreground">
            {t('selectIconTitle')}
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            {catalog ? `${allNames.length.toLocaleString(locale)} ${t('iconsAvailableSuffix')}` : t('loadingCatalog')}
          </DialogDescription>
        </DialogHeader>

        {/* Busca pelos nomes originais da Lucide */}
        <div className="relative mb-3 shrink-0">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchIconPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-secondary/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/60 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              title={t('clearSearchTitle')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grade limpa: só o ícone, com o nome no tooltip */}
        <div className="flex-1 overflow-y-auto min-h-[240px] pr-1">
          {!catalog ? (
            <div className="h-[240px] flex items-center justify-center text-muted-foreground gap-2 text-xs">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              <span>{t('loadingIcons')}</span>
            </div>
          ) : matches.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-muted-foreground text-xs">
              {t('noIconsFoundPrefix')} &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
              <button
                onClick={() => { onSelect(''); onClose(); }}
                title={t('noIconTitle')}
                className={`aspect-square flex items-center justify-center rounded-lg border transition-colors hover:cursor-pointer ${
                  !selectedIcon
                    ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                    : 'bg-secondary/30 border-transparent hover:border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Ban className="w-4 h-4" />
              </button>

              {visible.map((name) => {
                const IconComp = catalog[name];
                const isSelected = selectedIcon === name;
                return (
                  <button
                    key={name}
                    onClick={() => { onSelect(name); onClose(); }}
                    title={name}
                    className={`aspect-square flex items-center justify-center rounded-lg border transition-colors hover:cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                        : 'bg-secondary/30 border-transparent hover:border-orange-500/40 text-foreground/70 hover:text-orange-400'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {hiddenCount > 0 && (
          <p className="text-[10px] text-muted-foreground text-center pt-2.5 mt-2.5 border-t border-border/60 shrink-0">
            {t('showingPrefix')} {visible.length} {t('showingOfWord')} {matches.length.toLocaleString(locale)} — {t('showingSuffix')}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
