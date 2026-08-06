import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useProjectStore } from '@/store/useProjectStore';
import { BorderStyle, UnitType } from '@/store/templates';
import { hexToRgba, summarizeItemLabels, formatCurrency } from '@/lib/utils';
import { RenderLucideIcon } from '@/components/modals/IconSelectorModal';
import { ItemEditModal } from '@/components/modals/ItemEditModal';
import {
    Pencil,
    Trash2,
    ExternalLink,
    Plus,
    Minus,
    Sparkles,
    CheckCircle2,
    Check
} from 'lucide-react';
import { useT } from '@/lib/i18n/useT';
import { nodeDict } from '@/lib/i18n/dictionaries/node';

export const ItemNode: React.FC<NodeProps> = ({ id, data, isConnectable }) => {
    const { deleteNode, toggleNodeCollapse, toggleNodeCompleted, getNodeAggregation, getDirectRemainingItems, tags, isViewOnly } = useProjectStore();
    const t = useT(nodeDict);
    const [isHovered, setIsHovered] = useState(false);
    const [isEditingModal, setIsEditingModal] = useState(false);
    const [isCardMounted, setIsCardMounted] = useState(false);
    const [isCardClosing, setIsCardClosing] = useState(false);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const unmountCardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            if (unmountCardTimeoutRef.current) clearTimeout(unmountCardTimeoutRef.current);
        };
    }, []);

    // Controla a montagem do card de detalhes para permitir uma animação de saída simétrica à de entrada
    useEffect(() => {
        if (isHovered) {
            if (unmountCardTimeoutRef.current) {
                clearTimeout(unmountCardTimeoutRef.current);
                unmountCardTimeoutRef.current = null;
            }
            // eslint-disable-next-line react-hooks/set-state-in-effect -- orquestra montagem/desmontagem para animação de saída, não deriva de props
            setIsCardClosing(false);
            setIsCardMounted(true);
        } else if (isCardMounted) {
            setIsCardClosing(true);
            unmountCardTimeoutRef.current = setTimeout(() => {
                setIsCardMounted(false);
                setIsCardClosing(false);
            }, 150);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovered]);

    const name = data.name !== undefined ? (data.name as string) : t('defaultComponentName');
    const subtitle = (data.subtitle as string) || '';
    const description = (data.description as string) || '';
    const url = (data.url as string) || '';
    const icon = (data.icon as string) || '';
    const iconColor = (data.iconColor as string) || '';
    const iconStyle = iconColor ? { color: iconColor } : undefined;
    const quantity = Number(data.quantity) ?? 1;
    const cost = Number(data.cost) || 0;
    const unitType = (data.unitType as UnitType) || 'currency';
    const customUnit = (data.customUnit as string) || '';
    const tagId = (data.tagId as string) || '';
    const borderStyle = (data.borderStyle as BorderStyle) || 'circle';
    const isCollapsed = !!data.collapsed;
    const isCompleted = !!data.completed;

    const currentTag = tags.find((t) => t.id === tagId) || tags[0];
    const themeAccent = currentTag ? currentTag.color : '#ff6a13';

    // Soma de custo hierárquica herdada de todos os filhos (Componentes conectados abaixo)
    const aggregation = getNodeAggregation(id);
    const hasChildren = aggregation.hasInputs;
    const effectiveCost = hasChildren ? aggregation.totalCost : cost;

    // Itens pendentes da linha logo abaixo (composições são atravessadas), condensados para a pílula
    const directRemaining = getDirectRemainingItems(id);
    const { labels: remainingLabels, hiddenCount } = summarizeItemLabels(directRemaining);
    const allChildrenDone = directRemaining.length === 0;

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setIsHovered(true);
        const rfNode = e.currentTarget.closest('.react-flow__node') as HTMLElement | null;
        if (rfNode) {
            rfNode.style.zIndex = '99999';
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const rfNode = e.currentTarget.closest('.react-flow__node') as HTMLElement | null;
        // Delay para dar tempo do usuário mover o mouse até o card de detalhes sem ele sumir no meio do caminho
        hideTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            if (rfNode) {
                rfNode.style.zIndex = '';
            }
        }, 300);
    };

    return (
        <div
            className="relative flex flex-col items-center select-none font-sans py-2 w-37.5"
        >
            {/* HANDLES VERTICAIS APENAS (Sem laterais) - Árvore invertida: saída em cima (sobe para o pai), entrada embaixo (recebe dos filhos). Escondidos em modo Visualização. */}
            <Handle
                type="source"
                position={Position.Top}
                isConnectable={isConnectable}
                className={`w-3.5 h-3.5 bg-orange-500! border-2 border-background! dark:border-slate-950 shadow-md z-60 -top-2.5 hover:scale-125 transition-transform cursor-crosshair ${isViewOnly ? 'opacity-0! pointer-events-none' : ''}`}
            />
            <Handle
                type="target"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className={`w-3.5 h-3.5 bg-orange-500! border-2 border-background! dark:border-slate-950 shadow-md z-60 -bottom-2.5 hover:scale-125 transition-transform cursor-crosshair ${isViewOnly ? 'opacity-0! pointer-events-none' : ''}`}
            />

            {/* BOTÃO DE COLAPSAR / EXPANDIR FILHOS - ancorado ao nó inteiro (mesma referência do Handle inferior), para ficar concêntrico com o ponto onde as conexões dos filhos chegam */}
            {hasChildren && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleNodeCollapse(id);
                    }}
                    className={`absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-5 h-5 rounded-full transition-all shadow-md ${isCollapsed
                        ? 'bg-orange-600 hover:bg-orange-500 text-white border border-background dark:border-slate-950'
                        : 'bg-secondary hover:bg-accent dark:bg-slate-900 dark:hover:bg-slate-800 text-foreground/80 dark:text-slate-300 border border-border dark:border-slate-800 hover:border-orange-500/50'
                        }`}
                    title={isCollapsed ? t('expandChildrenTitle') : t('collapseChildrenTitle')}
                >
                    {isCollapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                </button>
            )}

            {/* PENDÊNCIAS DA LINHA DE BAIXO (só o que falta no nível imediatamente abaixo; aparece no hover) */}
            {hasChildren && isHovered && (
                <div
                    className={`absolute -top-9 px-3 py-0.5 rounded-full bg-card/95 dark:bg-slate-950/95 border shadow-[0_0_15px_rgba(255,106,19,0.4)] flex items-center gap-1.5 text-[11px] font-mono whitespace-nowrap z-30 pointer-events-none ${allChildrenDone ? 'border-emerald-500/60' : 'border-orange-500/60'
                        }`}
                >
                    {allChildrenDone ? (
                        <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('allDone')}</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-3 h-3 text-orange-600 dark:text-orange-400 shrink-0" />
                            <span className="text-foreground/80 dark:text-slate-300">{t('missing')}</span>
                            {remainingLabels.map((label, i) => (
                                <span key={label + i} className="text-amber-600 dark:text-amber-400 font-bold">
                                    {i > 0 ? '· ' : ''}{label}
                                </span>
                            ))}
                            {hiddenCount > 0 && (
                                <span className="text-muted-foreground dark:text-slate-400 font-bold">+{hiddenCount}</span>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* RENDERIZAÇÃO NO BOARD */}
            <div
                onClick={() => { if (!isViewOnly) setIsEditingModal(true); }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`group flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 z-10 ${isViewOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div
                    className="relative"
                >
                    <div style={{ opacity: isCompleted ? 0.4 : 1, filter: isCompleted ? 'grayscale(0.8)' : undefined, transition: 'opacity 0.3s ease, filter 0.3s ease' }}>
                        {/* FORMA 1: CÍRCULO */}
                        {borderStyle === 'circle' && (
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card/95 dark:bg-slate-950/95 border-2 flex items-center justify-center p-3 transition-all relative overflow-hidden"
                                style={{
                                    borderColor: `${themeAccent}90`,
                                    boxShadow: `0 0 ${isHovered ? '35px' : '25px'} ${hexToRgba(themeAccent, isHovered ? 0.45 : 0.25)}`,
                                }}
                            >
                                {icon ? (
                                    <RenderLucideIcon name={icon} className="w-8 h-8 sm:w-9 sm:h-9 text-orange-600 dark:text-orange-400 drop-shadow-[0_0_8px_rgba(255,106,19,0.6)]" style={iconStyle} />
                                ) : (
                                    <span className="text-xs font-semibold text-foreground dark:text-slate-100 text-center px-1 truncate w-full">{name}</span>
                                )}
                            </div>
                        )}

                        {/* FORMA 2: QUADRADO ARREDONDADO */}
                        {(borderStyle === 'rounded' || borderStyle === 'card' || borderStyle === 'square' || borderStyle === 'glow' || borderStyle === 'dashed') && (
                            <div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card/95 dark:bg-slate-950/95 border-2 flex items-center justify-center p-3 transition-all relative overflow-hidden"
                                style={{
                                    borderColor: `${themeAccent}90`,
                                    boxShadow: `0 0 ${isHovered ? '35px' : '25px'} ${hexToRgba(themeAccent, isHovered ? 0.45 : 0.25)}`,
                                }}
                            >
                                {icon ? (
                                    <RenderLucideIcon name={icon} className="w-8 h-8 sm:w-9 sm:h-9 text-orange-600 dark:text-orange-400 drop-shadow-[0_0_8px_rgba(255,106,19,0.6)]" style={iconStyle} />
                                ) : (
                                    <span className="text-xs font-semibold text-foreground dark:text-slate-100 text-center px-1 truncate w-full">{name}</span>
                                )}
                            </div>
                        )}

                        {/* FORMA 3: LOSANGO */}
                        {borderStyle === 'diamond' && (
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-1">
                                <div
                                    className="w-14 h-14 sm:w-16 sm:h-16 rotate-45 rounded-xl bg-card/95 dark:bg-slate-950/95 border-2 transition-all absolute"
                                    style={{
                                        borderColor: `${themeAccent}95`,
                                        boxShadow: `0 0 ${isHovered ? '45px' : '30px'} ${hexToRgba(themeAccent, isHovered ? 0.6 : 0.35)}`,
                                    }}
                                />
                                <div className="z-10 flex items-center justify-center pointer-events-auto">
                                    {icon ? (
                                        <RenderLucideIcon name={icon} className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 drop-shadow-[0_0_10px_rgba(255,106,19,0.8)]" style={iconStyle} />
                                    ) : (
                                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300 text-center max-w-17.5 truncate">{name}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FORMA 4: HEXÁGONO TECH (duas camadas recortadas para simular borda completa, já que clip-path corta a borda retangular original nas diagonais) */}
                        {borderStyle === 'hexagon' && (
                            <div
                                className="relative flex items-center justify-center w-24 h-20 my-0.5 transition-all"
                                style={{ filter: `drop-shadow(0 0 ${isHovered ? '20px' : '12px'} ${hexToRgba(themeAccent, isHovered ? 0.5 : 0.3)})` }}
                            >
                                {/* Camada da borda: preenchida com a cor da tag, recortada em hexágono */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: themeAccent,
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                    }}
                                />
                                {/* Camada do fundo: recortada no mesmo hexágono, encolhida 2px para revelar a borda de todos os lados */}
                                <div
                                    className="absolute inset-0.5 bg-card/95 dark:bg-slate-950/95"
                                    style={{
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                    }}
                                />
                                <div className="z-10 flex items-center justify-center px-2">
                                    {icon ? (
                                        <RenderLucideIcon name={icon} className="w-7 h-7 text-amber-600 dark:text-amber-400 drop-shadow" style={iconStyle} />
                                    ) : (
                                        <span className="text-xs font-semibold text-foreground dark:text-slate-100 text-center truncate">{name}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BOTÃO DE MARCAR COMO CONCLUÍDO (canto inferior esquerdo, sempre visível e nunca esmaecido) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleNodeCompleted(id);
                        }}
                        className={`absolute -bottom-1 -left-1.5 z-50 flex items-center justify-center w-5 h-5 rounded-full transition-all shadow-md ${isCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-background dark:border-slate-950'
                            : 'bg-secondary hover:bg-accent dark:bg-slate-900 dark:hover:bg-slate-800 text-muted-foreground dark:text-slate-400 border border-border dark:border-slate-800 hover:border-emerald-500/50'
                            }`}
                        title={isCompleted ? t('markAsPending') : t('markAsCompleted')}
                    >
                        {isCompleted ? <Check className="w-3.5 h-3.5 p-0.5" /> : <></>}
                    </button>
                </div>

                {/* NOME ABAIXO DO ÍCONE */}
                {icon && (
                    <div className="mt-1 text-center max-w-37.5">
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground dark:text-slate-100 px-2 py-0.5 rounded-lg bg-card/90 dark:bg-slate-950/90 border border-border dark:border-slate-800 block truncate shadow-sm">
                            {name}
                        </span>
                    </div>
                )}
            </div>

            {/* CARD DETALHADO NO HOVER - Sempre acima das conexões do board devido à elevação zIndex */}
            {isCardMounted && (
                <div
                    className={`absolute z-50 left-full ml-4 top-0 w-72 p-4 bg-card/95 dark:bg-slate-950/95 border border-orange-500/50 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col gap-3 font-sans text-left duration-150 pointer-events-auto ${isCardClosing ? 'animate-out fade-out zoom-out-95' : 'animate-in fade-in zoom-in-95'
                        }`}
                    style={{ boxShadow: '0 10px 45px -5px rgba(0,0,0,0.9), 0 0 30px rgba(255,106,19,0.3)' }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Cabeçalho do Card */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border dark:border-slate-800">
                        <div className="flex items-center gap-2 truncate">
                            {icon && (
                                <div className="p-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 shrink-0">
                                    <RenderLucideIcon name={icon} className="w-4 h-4" style={iconStyle} />
                                </div>
                            )}
                            <div className="truncate">
                                <h4 className="font-semibold text-sm text-foreground dark:text-slate-100 tracking-tight truncate">{name}</h4>
                                {subtitle && <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium block truncate">{subtitle}</span>}
                            </div>
                        </div>
                        {currentTag && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white shrink-0 shadow-sm" style={{ backgroundColor: themeAccent }}>
                                {currentTag.name}
                            </span>
                        )}
                    </div>

                    {/* Descrição Longa */}
                    {description ? (
                        <p className="text-xs text-foreground/80 dark:text-slate-300 font-normal leading-relaxed text-justify">
                            {description}
                        </p>
                    ) : (
                        <p className="text-[11px] text-muted-foreground dark:text-slate-400 italic">
                            {t('noDescriptionComponent')}
                        </p>
                    )}

                    {/* Cálculo: Custo Herdado ou Próprio */}
                    <div className="p-2.5 rounded-xl bg-secondary/60 dark:bg-slate-900/60 border border-border dark:border-slate-800 flex flex-col gap-1 text-xs font-mono">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground dark:text-slate-400 font-sans text-[11px]">
                                {hasChildren ? t('childrenSum') : t('costQuantity')}
                            </span>
                            <div className="text-right">
                                {unitType === 'currency' ? (
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {quantity > 1 ? `${quantity}x ${formatCurrency(effectiveCost)} = ` : ''}
                                        {formatCurrency(effectiveCost * quantity)}
                                    </span>
                                ) : unitType === 'custom' ? (
                                    <span className="font-medium text-amber-600 dark:text-amber-400">{quantity} {customUnit || t('unitAbbreviation')}</span>
                                ) : (
                                    <span className="text-muted-foreground dark:text-slate-400 italic font-sans text-[11px]">{t('uniqueComponent')}</span>
                                )}
                            </div>
                        </div>
                        {hasChildren && (
                            <span className="text-[10px] text-orange-600 dark:text-orange-400/80 font-sans italic">
                                {t('inheritedValueNote')}
                            </span>
                        )}
                    </div>

                    {/* URL Associada */}
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-medium transition-colors group/link truncate"
                        >
                            <span className="truncate pr-2">{t('accessLinkedLink')}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                    )}

                    {/* Rodapé do Card: Excluir e BOTÃO DE LÁPIS (escondido em modo Visualização) */}
                    {!isViewOnly && (
                        <div className="flex items-center justify-between pt-2 border-t border-border dark:border-slate-800 mt-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNode(id);
                                }}
                                className="p-1.5 text-muted-foreground dark:text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-secondary dark:hover:bg-slate-800 flex items-center gap-1 text-[11px]"
                                title={t('removeComponentTitle')}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{t('remove')}</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,106,19,0.5)] transition-all transform hover:scale-105"
                                title={t('editComponentTitle')}
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>{t('editComponent')}</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* MODAL DE EDIÇÃO */}
            <ItemEditModal
                nodeId={id}
                isOpen={isEditingModal}
                onClose={() => setIsEditingModal(false)}
            />
        </div>
    );
};
