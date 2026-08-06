import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import {
    Box,
    Tag as TagIcon,
    Sparkles,
    Trash2,
    GripHorizontal,
    Circle,
    Diamond as DiamondIcon,
    Hexagon as HexagonIcon,
    Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/useT';
import { sidebarDict } from '@/lib/i18n/dictionaries/sidebar';

export const Sidebar: React.FC = () => {
    const { tags, addTag, deleteTag } = useProjectStore();
    const t = useT(sidebarDict);
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#ff6a13');

    const handleCreateTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTagName.trim()) {
            addTag(newTagName.trim(), newTagColor);
            setNewTagName('');
            setIsCreatingTag(false);
        }
    };

    const onDragStart = (event: React.DragEvent, nodeType: string, defaultName: string, defaultShape?: string, defaultIcon?: string) => {
        event.dataTransfer.setData('application/reactflow-type', nodeType);
        event.dataTransfer.setData('application/reactflow-name', defaultName);
        if (defaultShape) {
            event.dataTransfer.setData('application/reactflow-shape', defaultShape);
        }
        if (defaultIcon) {
            event.dataTransfer.setData('application/reactflow-icon', defaultIcon);
        }
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-72 bg-card border-r border-border p-4 flex flex-col gap-5 select-none overflow-y-auto z-20 shadow-sm font-sans">

            {/* Seção 1: Nós de Componentes & Processos */}
            <div>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        {t('componentsAndForgeHeading')}
                    </h3>
                </div>
                <p className="text-[11px] font-normal text-muted-foreground mb-3 leading-relaxed px-1">
                    {t('dragComponentsIntro')}
                </p>

                <div className="flex flex-col gap-2.5">

                    {/* Círculo de Componente / Elemento */}
                    <Card
                        draggable
                        onDragStart={(event) => onDragStart(event, 'itemNode', t('circleDefaultName'), 'circle', 'Box')}
                        className="group p-3 bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/50 border-border hover:border-orange-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm flex flex-col gap-1 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Circle className="w-4 h-4" />
                                </div>
                                <span>{t('circleTitle')}</span>
                            </div>
                            <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-normal leading-snug">
                            {t('circleDesc')}
                        </p>
                    </Card>

                    {/* Caixa de Composição (Quadrado Arredondado) */}
                    <Card
                        draggable
                        onDragStart={(event) => onDragStart(event, 'itemNode', t('compositionDefaultName'), 'rounded', 'Layers')}
                        className="group p-3 bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/50 border-border hover:border-amber-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm flex flex-col gap-1 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <Box className="w-4 h-4" />
                                </div>
                                <span>{t('compositionTitle')}</span>
                            </div>
                            <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-normal leading-snug">
                            {t('compositionDescPrefix')}<span className="text-orange-600 dark:text-orange-400 font-mono">{t('compositionDescCostLabel')}</span>{t('compositionDescSuffix')}
                        </p>
                    </Card>

                    {/* Losango de Meta / Objetivo */}
                    <Card
                        draggable
                        onDragStart={(event) => onDragStart(event, 'itemNode', t('goalDefaultName'), 'diamond', 'Sparkles')}
                        className="group p-3 bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/50 border-border hover:border-red-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm flex flex-col gap-1 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <DiamondIcon className="w-4 h-4" />
                                </div>
                                <span>{t('goalTitle')}</span>
                            </div>
                            <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-normal leading-snug">
                            {t('goalDesc')}
                        </p>
                    </Card>

                    {/* Estação / Processo */}
                    <Card
                        draggable
                        onDragStart={(event) => onDragStart(event, 'stationNode', t('processDefaultName'), 'hexagon', 'Flame')}
                        className="group p-3 bg-secondary/40 dark:bg-secondary/50 hover:bg-secondary/50 border-border hover:border-orange-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 shadow-sm flex flex-col gap-1"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <HexagonIcon className="w-4 h-4" />
                                </div>
                                <span>{t('processTitle')}</span>
                            </div>
                            <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <p className="text-[11px] text-muted-foreground font-normal leading-snug">
                            {t('processDesc')}
                        </p>
                    </Card>

                </div>
            </div>

            <div className="h-px bg-border my-1" />

            {/* Seção 2: Tags customizadas do projeto */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            {t('componentTagsHeading')}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0 h-5">
                            {tags.length}
                        </Badge>
                        <button
                            onClick={() => setIsCreatingTag(!isCreatingTag)}
                            title={isCreatingTag ? t('cancelTitle') : t('createNewTagTitle')}
                            className="p-1 rounded-md border border-orange-500/30 text-orange-600 dark:text-orange-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 hover:cursor-pointer transition-colors"
                        >
                            <Plus className={`w-3.5 h-3.5 transition-transform ${isCreatingTag ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                </div>
                <p className="text-[11px] font-normal text-muted-foreground mb-3 px-1 leading-snug">
                    {t('tagsIntro')}
                </p>

                {isCreatingTag && (
                    <form onSubmit={handleCreateTag} className="mb-3 p-2 bg-secondary/50 border border-border rounded-xl flex items-center gap-2">
                        <input
                            type="text"
                            autoFocus
                            placeholder={t('tagNamePlaceholder')}
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="flex-1 min-w-0 px-2 py-1 bg-card border border-border rounded text-xs text-white focus:outline-none"
                        />
                        <input
                            type="color"
                            value={newTagColor}
                            onChange={(e) => setNewTagColor(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 shrink-0"
                        />
                        <Button size="sm" type="submit" className="h-7 px-3 bg-orange-600 hover:bg-orange-500 text-white text-xs shrink-0">
                            {t('createButton')}
                        </Button>
                    </form>
                )}

                <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-48 pr-1">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg text-xs font-normal text-white shadow-sm transition-transform hover:scale-105 group"
                            style={{ backgroundColor: tag.color }}
                        >
                            <span className="drop-shadow-sm font-normal">{tag.name}</span>
                            {tags.length > 1 && (
                                <button
                                    onClick={() => deleteTag(tag.id)}
                                    title={t('deleteTagTitle')}
                                    className="opacity-70 hover:opacity-100 hover:scale-110 transition-all ml-1 text-white/90 hover:text-white"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-[11px] text-muted-foreground text-center pt-4 border-t border-border/60 font-normal">
                {t('footerHint')}
            </div>
        </aside>
    );
};
