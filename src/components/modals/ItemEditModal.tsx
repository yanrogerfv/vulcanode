import React, { useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { BorderStyle, UnitType } from '@/store/templates';
import { RenderLucideIcon, IconSelectorModal } from './IconSelectorModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Circle,
    Box,
    Diamond as DiamondIcon,
    Hexagon as HexagonIcon,
    Check,
    Plus,
    Link2,
    RotateCcw
} from 'lucide-react';
import { useT } from '@/lib/i18n/useT';
import { editModalDict, EditModalDict } from '@/lib/i18n/dictionaries/editModal';

const SHAPE_OPTIONS: { value: BorderStyle; icon: React.ElementType; labelKey: keyof EditModalDict }[] = [
    { value: 'circle', icon: Circle, labelKey: 'shapeCircle' },
    { value: 'rounded', icon: Box, labelKey: 'shapeComposition' },
    { value: 'diamond', icon: DiamondIcon, labelKey: 'shapeGoal' },
    { value: 'hexagon', icon: HexagonIcon, labelKey: 'shapeHexagon' },
];

const UNIT_OPTIONS: { value: UnitType; labelKey: keyof EditModalDict }[] = [
    { value: 'currency', labelKey: 'unitCurrency' },
    { value: 'custom', labelKey: 'unitCustom' },
    { value: 'none', labelKey: 'unitNone' },
];

const fieldClass =
    'w-full px-2.5 py-1.5 bg-secondary/40 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-orange-500/60 transition-colors';

const labelClass = 'block text-[10px] uppercase tracking-wider text-muted-foreground mb-1';

// Cor de fallback exibida no seletor nativo enquanto nenhuma cor personalizada foi escolhida
const DEFAULT_ICON_COLOR = '#ff6a13';

interface Props {
    nodeId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ItemEditModal: React.FC<Props> = ({ nodeId, isOpen, onClose }) => {
    const { nodes, updateNodeData, tags, addTag, addCustomUnit } = useProjectStore();
    const t = useT(editModalDict);
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#ff6a13');

    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !isOpen) return null;

    const data = node.data || {};
    const name = data.name !== undefined ? (data.name as string) : '';
    const subtitle = (data.subtitle as string) || '';
    const description = (data.description as string) || '';
    const url = (data.url as string) || '';
    const icon = (data.icon as string) || '';
    const iconColor = (data.iconColor as string) || '';
    const quantity = Number(data.quantity) || 1;
    const cost = Number(data.cost) || 0;
    const unitType = (data.unitType as UnitType) || 'currency';
    const customUnit = (data.customUnit as string) || '';
    const tagId = (data.tagId as string) || '';
    const borderStyle = (data.borderStyle as BorderStyle) || 'circle';

    const isStation = node.type === 'stationNode';

    const handleCreateTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTagName.trim() && nodeId) {
            const created = addTag(newTagName.trim(), newTagColor);
            updateNodeData(nodeId, { tagId: created.id });
            setNewTagName('');
            setIsCreatingTag(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="p-5 bg-card border-border rounded-2xl w-[92vw] max-w-md sm:max-w-md md:max-w-md max-h-[85vh] flex flex-col shadow-2xl font-sans z-90 gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-base font-semibold text-foreground">
                            {isStation ? t('editProcessTitle') : t('editComponentTitle')}
                        </DialogTitle>
                        <DialogDescription className="text-[11px] text-muted-foreground">
                            {t('editModalDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3.5 overflow-y-auto pr-1 -mr-1">
                        {/* Ícone + Forma, lado a lado */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsIconModalOpen(true)}
                                    title={t('changeIconTitle')}
                                    className="w-11 h-11 shrink-0 rounded-xl bg-secondary/40 border border-border hover:border-orange-500/60 hover:cursor-pointer flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors"
                                >
                                    {icon ? (
                                        <RenderLucideIcon name={icon} className="w-5 h-5" style={iconColor ? { color: iconColor } : undefined} />
                                    ) : (
                                        <Plus className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </button>

                                {/* Cor do ícone: independente da cor da tag, afeta só o glifo */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <input
                                        type="color"
                                        value={iconColor || DEFAULT_ICON_COLOR}
                                        onChange={(e) => updateNodeData(nodeId!, { iconColor: e.target.value })}
                                        title={t('iconColorTitle')}
                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent "
                                    />
                                    {iconColor && (
                                        <button
                                            type="button"
                                            onClick={() => updateNodeData(nodeId!, { iconColor: '' })}
                                            title={t('resetIconColorTitle')}
                                            className="p-1 text-muted-foreground hover:text-foreground hover:cursor-pointer transition-colors"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-xl border border-border">
                                {SHAPE_OPTIONS.map(({ value, icon: ShapeIcon, labelKey }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => updateNodeData(nodeId!, { borderStyle: value })}
                                        title={t(labelKey)}
                                        className={`p-2 rounded-lg transition-colors hover:cursor-pointer ${borderStyle === value
                                            ? 'bg-orange-600 text-white'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <ShapeIcon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>

                        </div>

                        {/* Nome e subtítulo */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => updateNodeData(nodeId!, { name: e.target.value })}
                                placeholder={isStation ? t('namePlaceholderProcess') : t('namePlaceholderComponent')}
                                className={`${fieldClass} text-sm font-medium py-2`}
                            />
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => updateNodeData(nodeId!, { subtitle: e.target.value })}
                                placeholder={t('subtitlePlaceholder')}
                                className={fieldClass}
                            />
                        </div>

                        {/* Descrição */}
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => updateNodeData(nodeId!, { description: e.target.value })}
                            placeholder={t('descriptionPlaceholder')}
                            className={`${fieldClass} leading-relaxed resize-none`}
                        />

                        {/* URL */}
                        <div className="relative">
                            <Link2 className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => updateNodeData(nodeId!, { url: e.target.value })}
                                placeholder={t('urlPlaceholder')}
                                className={`${fieldClass} pl-8 font-mono text-orange-600 dark:text-orange-400`}
                            />
                        </div>

                        {!isStation && (
                            <>
                                {/* Valor e quantidade */}
                                <div className="flex items-end gap-2">
                                    <div className="shrink-0">
                                        <span className={labelClass}>{t('valueLabel')}</span>
                                        <div className="flex items-center gap-0.5 bg-secondary/40 p-0.5 rounded-lg border border-border">
                                            {UNIT_OPTIONS.map(({ value, labelKey }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => updateNodeData(nodeId!, { unitType: value })}
                                                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors hover:cursor-pointer ${unitType === value
                                                        ? 'bg-orange-600 text-white'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {t(labelKey)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {unitType !== 'none' && (
                                        <>
                                            <div className="w-16 shrink-0">
                                                <span className={labelClass}>{t('qtyLabel')}</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => updateNodeData(nodeId!, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                                    className={`${fieldClass} font-mono`}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {unitType === 'currency' ? (
                                                    <>
                                                        <span className={labelClass}>{t('unitCostLabel')}</span>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={cost === 0 ? '' : cost}
                                                            onChange={(e) => updateNodeData(nodeId!, { cost: parseFloat(e.target.value) || 0 })}
                                                            placeholder={t('costPlaceholder')}
                                                            className={`${fieldClass} font-mono text-emerald-600 dark:text-emerald-400`}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className={labelClass}>{t('unitLabel')}</span>
                                                        <input
                                                            type="text"
                                                            value={customUnit}
                                                            onChange={(e) => {
                                                                updateNodeData(nodeId!, { customUnit: e.target.value });
                                                                addCustomUnit(e.target.value.trim());
                                                            }}
                                                            placeholder={t('customUnitPlaceholder')}
                                                            className={`${fieldClass} font-mono text-amber-600 dark:text-amber-400`}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Tags: disponível para componentes e também para nós de processo */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className={`${labelClass} mb-0`}>{t('tagLabel')}</span>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingTag(!isCreatingTag)}
                                    className="text-[10px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:cursor-pointer font-medium transition-colors"
                                >
                                    {isCreatingTag ? t('cancelTag') : t('newTag')}
                                </button>
                            </div>

                            {/* p-0.5 evita que o anel de seleção seja cortado pelo container rolável */}
                            <div className="flex flex-wrap gap-1.5 max-h-19 overflow-y-auto p-0.5">
                                {tags.map((tag) => {
                                    const isSelected = tag.id === tagId;
                                    return (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => updateNodeData(nodeId!, { tagId: tag.id })}
                                            className={`px-2 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1 transition-opacity hover:cursor-pointer ${isSelected ? 'ring-2 ring-inset ring-white/90' : 'opacity-60 hover:opacity-100'
                                                }`}
                                            style={{ backgroundColor: tag.color }}
                                        >
                                            {isSelected && <Check className="w-3 h-3 shrink-0" />}
                                            <span className="drop-shadow-sm">{tag.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {isCreatingTag && (
                                <form onSubmit={handleCreateTag} className="mt-2 flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder={t('tagNamePlaceholder')}
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className={`${fieldClass} flex-1 min-w-0`}
                                    />
                                    <input
                                        type="color"
                                        value={newTagColor}
                                        onChange={(e) => setNewTagColor(e.target.value)}
                                        className="w-8 h-8 shrink-0 rounded-lg cursor-pointer bg-transparent border-0"
                                    />
                                    <Button
                                        size="sm"
                                        type="submit"
                                        className="h-8 px-3 shrink-0 bg-orange-600 hover:bg-orange-500 text-white text-xs rounded-lg hover:cursor-pointer"
                                    >
                                        {t('createButton')}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full mt-4 shrink-0 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl h-9 hover:cursor-pointer"
                    >
                        {t('doneButton')}
                    </Button>
                </DialogContent>
            </Dialog>

            <IconSelectorModal
                isOpen={isIconModalOpen}
                onClose={() => setIsIconModalOpen(false)}
                selectedIcon={icon}
                onSelect={(newIcon) => updateNodeData(nodeId!, { icon: newIcon })}
            />
        </>
    );
};
