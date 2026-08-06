import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { useProjectStore, ProjectItem } from '@/store/useProjectStore';
import { formatCurrency } from '@/lib/utils';
import {
    Anvil,
    Sun,
    Moon,
    Share2,
    Download,
    Trash2,
    Check,
    Sparkles,
    Plus,
    X,
    Minimize2,
    Maximize2,
    AlertTriangle,
    Pencil,
    Eye,
    Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent
} from '@/components/ui/hover-card';
import { useT } from '@/lib/i18n/useT';
import { headerDict } from '@/lib/i18n/dictionaries/header';

interface Props {
    onOpenTemplates: () => void;
}

/**
 * Para embutir as fontes no PNG, o html-to-image varre `document.styleSheets`. Folhas que o
 * navegador trata como cross-origin (extensões, por exemplo) lançam SecurityError ao ler
 * `cssRules` — a lib já captura isso e segue normalmente, mas deixa um `console.error` ruidoso
 * ("Failed to read the 'cssRules' property..."). Silenciamos só essas mensagens conhecidas
 * durante a exportação; o embed das folhas legíveis (onde vivem as @font-face do next/font)
 * continua intacto, então o texto do PNG mantém a tipografia correta.
 */
function withSuppressedStylesheetWarnings<T>(run: () => Promise<T>): Promise<T> {
    const originalError = console.error;
    const BENIGN = /Error while reading CSS rules|Error inlining remote css|cssRules/;

    console.error = (...args: unknown[]) => {
        const isBenign = args.some(
            (arg) =>
                (typeof arg === 'string' && BENIGN.test(arg)) ||
                (arg instanceof Error && BENIGN.test(arg.message))
        );
        if (isBenign) return;
        originalError(...args);
    };

    return run().finally(() => {
        console.error = originalError;
    });
}

interface ItemsColumnProps {
    title: string;
    accentClass: string;
    items: ProjectItem[];
    emptyLabel: string;
    emptyClass: string;
    showCompletedState?: boolean;
}

/** Coluna rolável do card de progresso. A altura vem do grid pai, então só a lista rola. */
const ItemsColumn: React.FC<ItemsColumnProps> = ({
    title,
    accentClass,
    items,
    emptyLabel,
    emptyClass,
    showCompletedState = false,
}) => (
    <div className="flex flex-col min-h-0">
        <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between gap-2 shrink-0">
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${accentClass}`}>{title}</span>
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{items.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-1.5 py-1.5 flex flex-col gap-0.5">
            {items.length === 0 ? (
                <p className={`px-1.5 py-2 text-[11px] italic ${emptyClass}`}>{emptyLabel}</p>
            ) : (
                items.map((item) => {
                    const isDone = showCompletedState && item.completed;
                    const qtyLabel = item.unitLabel
                        ? `${item.quantity} ${item.unitLabel}`
                        : item.quantity > 1
                            ? `${item.quantity}x`
                            : '';

                    return (
                        <div
                            key={item.id}
                            className="px-1.5 py-1 rounded-md hover:bg-foreground/5 flex items-center justify-between gap-2 text-[11px] transition-colors"
                            title={item.name}
                        >
                            <span className={`flex items-center gap-1.5 min-w-0 ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                {isDone && <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
                                <span className="truncate">{item.name}</span>
                            </span>

                            <span className="font-mono text-[10px] text-muted-foreground shrink-0 tabular-nums flex items-center gap-1.5">
                                {qtyLabel && <span className="text-amber-600 dark:text-amber-400/80">{qtyLabel}</span>}
                                {item.totalCost > 0 && <span className="text-emerald-600 dark:text-emerald-400/80">{formatCurrency(item.totalCost)}</span>}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    </div>
);

export const Header: React.FC<Props> = ({ onOpenTemplates }) => {
    const {
        projectTitle,
        setProjectTitle,
        theme,
        toggleTheme,
        language,
        setLanguage,
        getProgressSummary,
        getProjectItemsBreakdown,
        clearCanvas,
        exportURL,
        exportJSON,
        nodes,
        collapseAll,
        expandAll,
        isViewOnly
    } = useProjectStore();

    const t = useT(headerDict);
    const router = useRouter();
    const { getNodes } = useReactFlow();
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [isConfirmingClear, setIsConfirmingClear] = useState(false);
    const [isPerformanceWarningOpen, setIsPerformanceWarningOpen] = useState(false);
    const [isConfirmingNewProject, setIsConfirmingNewProject] = useState(false);
    const [isConfirmingGoHome, setIsConfirmingGoHome] = useState(false);

    const progress = getProgressSummary();
    const breakdown = getProjectItemsBreakdown();
    const isEverythingDone = progress.totalNodes > 0 && progress.completedNodes === progress.totalNodes;

    // Só faz sentido avisar sobre perder o trabalho atual se existe trabalho atual
    const handleNewProjectClick = () => {
        if (nodes.length > 0) {
            setIsConfirmingNewProject(true);
        } else {
            onOpenTemplates();
        }
    };

    const handleConfirmNewProject = () => {
        setIsConfirmingNewProject(false);
        onOpenTemplates();
    };

    // Mesma lógica de "só avisar se há trabalho em risco de ser perdido de vista" do botão Nova Crafting Tree
    const handleLogoClick = () => {
        if (nodes.length > 0) {
            setIsConfirmingGoHome(true);
        } else {
            router.push('/');
        }
    };

    const handleConfirmGoHome = () => {
        setIsConfirmingGoHome(false);
        router.push('/');
    };

    const handleExpandAllClick = () => {
        if (nodes.length > 25) {
            setIsPerformanceWarningOpen(true);
        } else {
            expandAll();
        }
    };

    const handleConfirmExpandAll = () => {
        expandAll();
        setIsPerformanceWarningOpen(false);
    };

    const handleShare = (mode: 'edit' | 'view') => {
        const encoded = exportURL();
        const shareUrl = `${window.location.origin}/app?share=${encoded}${mode === 'view' ? '&mode=view' : ''}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopiedUrl(true);
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.2 },
                colors: ['#ff6a13', '#eab308', '#ffffff']
            });
            setTimeout(() => setCopiedUrl(false), 4000);
        });
    };

    // Exporta a árvore INTEIRA, não só o pedaço visível: calculamos o retângulo que
    // envolve todos os nós e aplicamos essa transformação ao viewport na hora do print.
    const handleExportPNG = () => {
        const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null;
        if (!viewport) return;

        const measuredNodes = getNodes();
        if (measuredNodes.length === 0) return;

        const bounds = getNodesBounds(measuredNodes);
        const padding = 80;
        const imageWidth = Math.ceil(bounds.width) + padding * 2;
        const imageHeight = Math.ceil(bounds.height) + padding * 2;

        const { x, y, zoom } = getViewportForBounds(
            bounds,
            imageWidth,
            imageHeight,
            0.1,
            2,
            padding / Math.max(imageWidth, imageHeight)
        );

        withSuppressedStylesheetWarnings(() =>
            toPng(viewport, {
                backgroundColor: theme === 'dark' ? '#090a0d' : '#f8fafc',
                width: imageWidth,
                height: imageHeight,
                style: {
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    transform: `translate(${x}px, ${y}px) scale(${zoom})`,
                },
            })
        )
            .then((dataUrl) => {
                const link = document.createElement('a');
                const sanitizedTitle = projectTitle.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-');
                link.download = `${sanitizedTitle || 'vulcanode'}-vulcanode.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Erro ao exportar PNG:', err);
            });
    };

    const handleExportJSON = () => {
        const jsonString = exportJSON();
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const sanitizedTitle = projectTitle.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '_');
        link.download = `${sanitizedTitle || 'vulcanode'}-vulcanode.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between gap-4 select-none z-30 shadow-sm font-sans">

                {/* Esquerda: Logo e Título do Projeto */}
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={handleLogoClick}
                        title={t('goHomeIconTitle')}
                        className="flex items-center gap-2.5 text-foreground group hover:opacity-90 transition-opacity hover:cursor-pointer"
                    >
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,106,19,0.3)] group-hover:scale-105 transition-transform shrink-0">
                            <Anvil className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-semibold text-lg tracking-tight block leading-none">Vulca<span className="text-orange-500">node</span></span>
                            <span className="text-[9px] uppercase font-normal text-muted-foreground tracking-wide block mt-0.5">Modular Forge</span>
                        </div>
                    </button>

                    <div className="h-6 w-px bg-border hidden sm:block mx-1" />

                    <Input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        readOnly={isViewOnly}
                        title={isViewOnly ? projectTitle : t('renameProject')}
                        className={`font-medium text-sm sm:text-base bg-transparent text-foreground focus-visible:ring-1 focus-visible:ring-orange-500 rounded-lg px-2.5 py-1 h-9 min-w-35 max-w-45 md:max-w-xs truncate border-transparent transition-colors font-sans shadow-none ${isViewOnly ? 'cursor-default' : 'hover:border-border'
                            }`}
                    />

                    {/* Nova Crafting Tree (abre os templates, confirmando antes se já houver algo no board) */}
                    {!isViewOnly && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNewProjectClick}
                            title={t('newCraftingTree')}
                            className="h-9 w-9 rounded-xl shrink-0 border-border/80 bg-secondary/20 hover:bg-secondary hover:border-orange-500/50 hover:cursor-pointer transition-colors"
                        >
                            <Plus className="w-4 h-4 text-orange-500" />
                        </Button>
                    )}
                </div>

                {/* Centro: Controles Hierárquicos de Colapsar/Expandir & Resumo Geral */}
                <div className="hidden lg:flex items-center gap-3">

                    {/* Ações Rápidas de Árvore */}
                    <div className="flex items-center gap-1 bg-secondary/60 border border-border/80 rounded-xl p-1 text-xs shadow-inner">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={collapseAll}
                            className="h-7 px-2.5 text-xs font-normal text-foreground/80 hover:text-foreground hover:bg-accent flex items-center gap-1"
                            title={t('collapseAllTitle')}
                        >
                            <Minimize2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>{t('collapseAll')}</span>
                        </Button>

                        <div className="w-px h-4 bg-border/60" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExpandAllClick}
                            className="h-7 px-2.5 text-xs font-normal text-foreground/80 hover:text-foreground hover:bg-accent flex items-center gap-1"
                            title={t('expandAllTitle')}
                        >
                            <Maximize2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>{t('expandAll')}</span>
                        </Button>
                    </div>

                    {/* Progresso da Árvore: barra compacta + card detalhado no hover */}
                    <HoverCard>
                        <HoverCardTrigger
                            className="flex items-center gap-2.5 bg-secondary/50 dark:bg-secondary/50 border border-border/80 px-3 h-8 rounded-xl text-xs cursor-default hover:border-orange-500/40 transition-colors"
                            title={t('treeProgress')}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                            <div className="w-28 h-1.5 rounded-full bg-secondary overflow-hidden shrink-0">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isEverythingDone
                                        ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                                        : 'bg-linear-to-r from-orange-500 to-amber-400'
                                        }`}
                                    style={{ width: `${progress.percent}%` }}
                                />
                            </div>
                            <span className={`font-mono font-medium tabular-nums ${isEverythingDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground/80'}`}>
                                {progress.percent}%
                            </span>
                            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                                {progress.completedNodes}/{progress.totalNodes}
                            </span>
                        </HoverCardTrigger>

                        <HoverCardContent align="center" side="bottom" className="w-110 font-sans bg-background/50 backdrop-blur-sm">
                            <div className="flex flex-col">
                                {/* Duas colunas: pendências à esquerda, projeto completo à direita */}
                                <div className="grid grid-cols-2 divide-x divide-border/60 h-60">
                                    <ItemsColumn
                                        title={t('remainingColumn')}
                                        accentClass="text-amber-700 dark:text-amber-300"
                                        items={breakdown.remaining}
                                        emptyLabel={breakdown.all.length === 0 ? t('noComponentsYet') : t('allDone')}
                                        emptyClass={breakdown.all.length === 0 ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}
                                    />
                                    <ItemsColumn
                                        title={t('summaryColumn')}
                                        accentClass="text-orange-700 dark:text-orange-300"
                                        items={breakdown.all}
                                        emptyLabel={t('noComponentsYet')}
                                        emptyClass="text-muted-foreground"
                                        showCompletedState
                                    />
                                </div>

                                {/* Rodapé fixo com as somas monetárias (some se nada na árvore tem valor) */}
                                {breakdown.hasAnyCost && (
                                    <div className="grid grid-cols-2 divide-x divide-border/60 border-t border-border/60 shrink-0">
                                        <div className="px-3 py-2 flex items-center justify-between gap-2">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('left')}</span>
                                            <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-300 tabular-nums">
                                                {formatCurrency(breakdown.remainingCost)}
                                            </span>
                                        </div>
                                        <div className="px-3 py-2 flex items-center justify-between gap-2">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('total')}</span>
                                            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                {formatCurrency(breakdown.totalCost)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </div>

                {/* Direita: Ações, Exportações e Temas */}
                <div className="flex items-center gap-2 shrink-0">

                    {/* Alternar Idioma da Interface */}
                    <div className="hidden sm:flex items-center gap-0.5 bg-secondary/40 border border-border rounded-xl p-0.5 text-xs">
                        <button
                            onClick={() => setLanguage('pt')}
                            title={t('switchToPortuguese')}
                            className={`h-7 px-2 rounded-lg text-xs font-medium transition-colors hover:cursor-pointer ${language === 'pt' ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            PT
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            title={t('switchToEnglish')}
                            className={`h-7 px-2 rounded-lg text-xs font-medium transition-colors hover:cursor-pointer ${language === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            EN
                        </button>
                    </div>

                    {/* Alternar Tema */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? t('switchToLightTheme') : t('switchToDarkTheme')}
                        className="h-9 w-9 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-orange-500 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                    </Button>

                    {/* Exportar */}
                    <div className="flex items-center gap-1 bg-secondary/40 border border-border rounded-xl p-0.5 text-xs">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExportPNG}
                            title={t('downloadPng')}
                            className="h-7 px-2 font-normal text-xs rounded-lg hover:bg-accent gap-1 text-foreground/80 hover:text-foreground"
                        >
                            <Download className="w-3.5 h-3.5 text-blue-400" />
                            <span className="hidden sm:inline font-normal">PNG</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleExportJSON}
                            title={t('downloadJson')}
                            className="h-7 px-2 font-normal text-xs rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground"
                        >
                            <span className="hidden sm:inline font-normal">JSON</span>
                        </Button>
                    </div>

                    {/* Compartilhar via URL: menu com opção Editável ou Somente Visualização */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            title={t('shareProject')}
                            className="h-9 px-3.5 bg-orange-600 hover:bg-orange-500 text-white font-normal text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all border-none cursor-pointer"
                        >
                            {copiedUrl ? <Check className="w-4 h-4 text-emerald-200 shrink-0" /> : <Share2 className="w-4 h-4 shrink-0" />}
                            <span className="font-normal">{copiedUrl ? t('copied') : t('share')}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-55">
                            <DropdownMenuItem onClick={() => handleShare('edit')} className="gap-2">
                                <Pencil className="w-3.5 h-3.5 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{t('shareEditable')}</span>
                                    <span className="text-[10px] text-muted-foreground">{t('shareEditableDesc')}</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('view')} className="gap-2">
                                <Eye className="w-3.5 h-3.5 text-orange-500" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{t('shareViewOnly')}</span>
                                    <span className="text-[10px] text-muted-foreground">{t('shareViewOnlyDesc')}</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Limpar Canvas */}
                    {!isViewOnly && (
                        isConfirmingClear ? (
                            <div className="flex items-center gap-1 text-xs bg-red-950/90 border border-red-800 p-0.5 rounded-xl">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        clearCanvas();
                                        setIsConfirmingClear(false);
                                    }}
                                    className="h-7 px-2 text-xs font-normal rounded-lg bg-red-600 hover:bg-red-500"
                                >
                                    {t('yesClear')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsConfirmingClear(false)}
                                    className="h-7 w-7 text-foreground/80 hover:text-white rounded-lg hover:bg-red-900/50"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsConfirmingClear(true)}
                                title={t('clearCanvas')}
                                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-secondary transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )
                    )}

                </div>
            </header>

            {/* MODAL DE CONFIRMAÇÃO: NOVA CRAFTING TREE (sobrescreve a atual) */}
            <Dialog open={isConfirmingNewProject} onOpenChange={setIsConfirmingNewProject}>
                <DialogContent className="p-6 bg-card border-red-500/40 rounded-2xl w-[92vw] max-w-md sm:max-w-md md:max-w-md shadow-2xl font-sans z-100">
                    <DialogHeader className="flex flex-row items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-foreground">
                                {t('confirmNewProjectTitle')}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {t('confirmNewProjectDesc')}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-2 text-xs text-foreground/80 leading-relaxed text-center">
                        {t('confirmNewProjectBodyPrefix')} <b className="text-orange-600 dark:text-orange-400">{projectTitle}</b> {t('confirmNewProjectBodyHas')} <b>{nodes.length} {nodes.length === 1 ? t('componentSingular') : t('componentPlural')}</b> <b className="text-red-400">{t('confirmNewProjectBodyOverwritten')}</b> {t('confirmNewProjectBodyLostIntro')}
                        {' '}{t('confirmNewProjectBodyLostList')}
                        <br /><br />
                        {t('confirmNewProjectBodyBackupHint')} <b>{t('jsonWord')}</b>.
                    </div>

                    <DialogFooter className="flex items-center gap-2 bg-card sm:justify-end mt-4 border-t border-border pt-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsConfirmingNewProject(false)}
                            className="h-8 text-xs font-normal text-muted-foreground hover:text-foreground hover:cursor-pointer"
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleConfirmNewProject}
                            className="h-8 px-4 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-xl hover:cursor-pointer"
                        >
                            {t('yesCreateNew')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE ALERTA DE PERFORMANCE (> 25 NÓS) */}
            <Dialog open={isPerformanceWarningOpen} onOpenChange={setIsPerformanceWarningOpen}>
                <DialogContent className="p-6 bg-card border-amber-500/50 rounded-2xl w-[92vw] max-w-md sm:max-w-md md:max-w-md shadow-2xl font-sans z-100">
                    <DialogHeader className="flex flex-row items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                            <AlertTriangle className="w-6 h-6 animate-bounce" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-foreground">
                                {t('performanceWarningTitle')}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {t('performanceWarningDesc')}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-2 text-xs text-foreground/80 leading-relaxed">
                        {t('performanceWarningBodyPrefix')} <b>{nodes.length} {t('componentsWord')}</b>. {t('performanceWarningBodySuffix')}
                        <br /><br />
                        {t('performanceWarningQuestion')}
                    </div>

                    <DialogFooter className="flex items-center gap-2 bg-card sm:justify-end mt-4 border-t border-border pt-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPerformanceWarningOpen(false)}
                            className="h-8 text-xs font-normal text-muted-foreground hover:text-foreground"
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleConfirmExpandAll}
                            className="h-8 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        >
                            {t('yesExpandAll')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE CONFIRMAÇÃO: VOLTAR AO INÍCIO (só aparece se o board não estiver vazio) */}
            <Dialog open={isConfirmingGoHome} onOpenChange={setIsConfirmingGoHome}>
                <DialogContent className="p-6 bg-card border-orange-500/40 border rounded-2xl w-[92vw] max-w-md sm:max-w-md md:max-w-md shadow-2xl font-sans z-100">
                    <DialogHeader className="flex flex-row items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 shrink-0">
                            <Home className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-foreground">
                                {t('goHomeTitle')}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {t('goHomeDesc')}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-2 text-xs text-foreground/80 leading-relaxed text-center">
                        {t('goHomeBodyPrefix')} <b className="text-orange-600 dark:text-orange-400">{projectTitle}</b> {t('goHomeBodySuffix')}
                    </div>

                    <DialogFooter className="flex items-center gap-2 bg-card sm:justify-end mt-4 border-t border-border pt-3 ">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsConfirmingGoHome(false)}
                            className="h-8 text-xs font-normal text-muted-foreground hover:text-foreground hover:cursor-pointer"
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleConfirmGoHome}
                            className="h-8 px-4 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl hover:cursor-pointer"
                        >
                            {t('yesGoHome')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
