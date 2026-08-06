import React from 'react';
import { useProjectStore, ProjectTemplate } from '@/store/useProjectStore';
import { Sparkles, Sword, Home, Cake, FilePlus, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/lib/i18n/useT';
import { templateSelectorDict } from '@/lib/i18n/dictionaries/templateSelector';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { loadTemplate, importJSON } = useProjectStore();
  const t = useT(templateSelectorDict);

  const handleSelect = (template: ProjectTemplate) => {
    loadTemplate(template);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (content && importJSON(content)) {
          onClose();
        } else {
          alert(t('invalidFile'));
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerUpload = () => {
    const input = document.getElementById('json-upload-input') as HTMLInputElement;
    if (input) input.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-6 md:p-8 bg-card border-border rounded-2xl shadow-2xl font-sans">

        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl" />
        </div>

        <DialogHeader className="mb-6 text-center relative z-10 sm:text-center items-center">
          <Badge variant="outline" className="px-3 py-1 bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-normal uppercase tracking-widest mb-3 gap-2 shadow-sm font-sans">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> {t('badge')}
          </Badge>
          <DialogTitle className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-sans">
            {t('titlePrefix')} <span className="text-orange-500 font-semibold">{t('titleHighlight')}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm max-w-lg mx-auto pt-1 font-normal">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4 relative z-10">

          {/* Template Em Branco */}
          <Card
            onClick={() => handleSelect('blank')}
            className="group relative bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/60 border-border hover:border-orange-500/60 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_0_25px_rgba(255,106,19,0.15)]"
          >
            <CardHeader className="p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground/80 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-4 shadow-sm">
                <FilePlus className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-medium text-foreground font-sans">{t('blankTitle')}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-normal leading-relaxed pt-1">
                {t('blankDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-4 border-t border-border text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center justify-between w-full">
              <span>{t('blankFooter')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </CardFooter>
          </Card>

          {/* Template RPG */}
          <Card
            onClick={() => handleSelect('rpg')}
            className="group relative bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/60 border-border hover:border-orange-500/60 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_0_25px_rgba(255,106,19,0.2)]"
          >
            <CardHeader className="p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform mb-4 shadow-sm">
                <Sword className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-medium text-foreground font-sans">{t('rpgTitle')}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-normal leading-relaxed pt-1">
                {t('rpgDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-4 border-t border-border text-xs font-medium text-orange-500 flex items-center justify-between w-full">
              <span>{t('rpgFooter')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </CardFooter>
          </Card>

          {/* Template Orçamento / Composição */}
          <Card
            onClick={() => handleSelect('budget')}
            className="group relative bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/60 border-border hover:border-amber-500/60 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]"
          >
            <CardHeader className="p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform mb-4 shadow-sm">
                <Home className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-medium text-foreground font-sans">{t('budgetTitle')}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-normal leading-relaxed pt-1">
                {t('budgetDescriptionPrefix')} <span className="text-orange-600 dark:text-orange-400 font-medium">{t('budgetDescriptionComponents')}</span> {t('budgetDescriptionMiddle')}<span className="text-emerald-600 dark:text-emerald-400 font-mono">{t('budgetDescriptionCost')}</span>{t('budgetDescriptionSuffix')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-4 border-t border-border text-xs font-medium text-amber-500 flex items-center justify-between w-full">
              <span>{t('budgetFooter')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </CardFooter>
          </Card>

          {/* Template Receita / Bolo */}
          <Card
            onClick={() => handleSelect('cake')}
            className="group relative bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/60 border-border hover:border-pink-500/60 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]"
          >
            <CardHeader className="p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform mb-4 shadow-sm">
                <Cake className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-medium text-foreground font-sans">{t('cakeTitle')}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-normal leading-relaxed pt-1">
                {t('cakeDescription')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-6 pt-4 border-t border-border text-xs font-medium text-pink-500 flex items-center justify-between w-full">
              <span>{t('cakeFooter')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </CardFooter>
          </Card>

        </div>

        {/* Rodapé: Importar JSON */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 relative z-10">
          <span className="text-xs font-normal text-muted-foreground">
            {t('importPrompt')}
          </span>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={triggerUpload}
              className="cursor-pointer gap-2 border-border hover:bg-accent text-xs font-normal rounded-xl h-9 shadow-sm text-foreground"
            >
              <Upload className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>{t('importButton')}</span>
            </Button>
            <input id="json-upload-input" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
