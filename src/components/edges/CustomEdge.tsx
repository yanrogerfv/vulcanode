import React, { useState } from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { useProjectStore } from '@/store/useProjectStore';
import { Check, Trash2, Plus } from 'lucide-react';
import { useT } from '@/lib/i18n/useT';
import { canvasDict } from '@/lib/i18n/dictionaries/canvas';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const { updateEdgeData, deleteEdge, theme, isViewOnly } = useProjectStore();
  const t = useT(canvasDict);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const label = data?.label !== undefined ? (data.label as string) : '';
  const [inputVal, setInputVal] = useState(label);

  // Linhas ortogonais com ângulos arredondados para estética de Crafting Tree
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const handleSave = () => {
    updateEdgeData(id, inputVal);
    setIsEditing(false);
  };

  const edgeColor = theme === 'dark' ? '#ff6a13' : '#ea580c';
  // Com rótulo preenchido, a pílula fica sempre visível; sem rótulo, só aparece no hover
  const showControls = isHovered || isEditing || !!label;

  return (
    <g 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="group/edge cursor-pointer"
    >
      {/* Linha visível do edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: isHovered ? 3.5 : 2.5,
          stroke: isHovered ? '#f97316' : edgeColor,
          filter: theme === 'dark' ? 'drop-shadow(0 0 6px rgba(255, 106, 19, 0.5))' : undefined,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
          ...style,
        }}
      />

      {/* Linha transparente mais larga para capturar hover com facilidade */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: showControls ? 'all' : 'none',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`z-50 font-sans transition-opacity duration-200 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isEditing ? (
            <div className="flex items-center gap-1 bg-secondary border-2 border-orange-500 rounded-full px-2.5 py-1 shadow-2xl text-xs">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                placeholder={t('labelPlaceholder')}
                className="w-28 bg-transparent text-white focus:outline-none font-normal text-xs text-center placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSave}
                className="p-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-300 transition-colors"
                title={t('saveLabelTitle')}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : label ? (
            /* Quando já existe um rótulo digitado na linha (só aparece no hover, igual ao estado sem rótulo) */
            <div className="flex items-center gap-1.5 bg-card/95 text-foreground px-3 py-1 rounded-full text-xs font-normal shadow-lg border border-orange-500/50 hover:border-orange-500 transition-all">
              <span
                onClick={() => { if (!isViewOnly) setIsEditing(true); }}
                className={`font-mono text-[11px] text-orange-700 dark:text-orange-300 font-semibold transition-colors ${isViewOnly ? '' : 'cursor-pointer hover:text-white'}`}
                title={isViewOnly ? undefined : t('editLabelTitle')}
              >
                {label}
              </span>
              {!isViewOnly && (
                <>
                  <div className="w-px h-3 bg-secondary" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEdge(id);
                    }}
                    className="p-0.5 text-muted-foreground hover:text-red-500 transition-colors hover:scale-110"
                    title={t('removeConnectionTitle')}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          ) : isViewOnly ? null : (
            /* Estado padrão sem rótulo: apenas dois botões circulares (+ e 🗑) que aparecem no HOVER */
            <div className="flex items-center gap-1.5 bg-card/95 border border-border p-1 rounded-full shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setIsEditing(true)}
                className="w-6 h-6 rounded-full bg-secondary hover:bg-orange-600 text-foreground/80 hover:text-white flex items-center justify-center transition-all border border-border hover:border-orange-500 hover:scale-110"
                title={t('addLabelTitle')}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEdge(id);
                }}
                className="w-6 h-6 rounded-full bg-secondary hover:bg-red-600 text-foreground/80 hover:text-white flex items-center justify-center transition-all border border-border hover:border-red-500 hover:scale-110"
                title={t('removeEdgeTitle')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </g>
  );
};
