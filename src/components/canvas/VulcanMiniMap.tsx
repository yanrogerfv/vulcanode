import React, { useEffect, useMemo, useState } from 'react';
import { MiniMap, Panel, useNodes, useEdges } from '@xyflow/react';
import type { MiniMapNodeProps } from '@xyflow/react';
import { useProjectStore } from '@/store/useProjectStore';
import { useIconCatalog } from '@/lib/iconRegistry';
import { hexToRgba } from '@/lib/utils';

// Precisam bater com os defaults do MiniMap do React Flow (200x150), já que a
// camada de conexões é um SVG sobreposto com exatamente as mesmas dimensões.
const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 150;
const FALLBACK_NODE_SIZE = 150;

const COMPOSITION_STYLES = new Set(['rounded', 'card', 'square', 'glow', 'dashed']);

/** Centro do nó em coordenadas do fluxo — usado para ligar as conexões. */
function nodeCenter(node: { position: { x: number; y: number }; measured?: { width?: number | null; height?: number | null } }) {
    const width = node.measured?.width ?? FALLBACK_NODE_SIZE;
    const height = node.measured?.height ?? FALLBACK_NODE_SIZE;
    return { cx: node.position.x + width / 2, cy: node.position.y + height / 2 };
}

/**
 * Nó do minimapa desenhado com a MESMA forma do board (círculo, quadrado, losango
 * ou hexágono), colorido pela tag e com o ícone do componente no centro — caindo
 * para a primeira letra do nome quando não há ícone.
 */
const MiniMapShape: React.FC<MiniMapNodeProps> = ({ id, x, y, width, height }) => {
    const { nodes, tags } = useProjectStore();
    const catalog = useIconCatalog();

    const node = nodes.find((n) => n.id === id);
    if (!node) return null;

    const isStation = node.type === 'stationNode';
    const tagId = node.data?.tagId as string | undefined;
    const tag = tagId ? tags.find((t) => t.id === tagId) : undefined;
    const color = isStation ? '#f59e0b' : tag?.color ?? '#ff6a13';
    const isCompleted = !!node.data?.completed;

    const borderStyle = (node.data?.borderStyle as string) || (isStation ? 'hexagon' : 'circle');
    const iconName = (node.data?.icon as string) || '';
    const name = ((node.data?.name as string) || '').trim();

    const cx = x + width / 2;
    const cy = y + height / 2;
    const unit = Math.min(width, height);

    // Concluídos ficam apagados, espelhando o esmaecimento do board
    const fill = hexToRgba(color, isCompleted ? 0.15 : 0.85);
    const strokeWidth = Math.max(unit * 0.03, 1);

    let shape: React.ReactNode;
    if (borderStyle === 'circle') {
        shape = <circle cx={cx} cy={cy} r={unit * 0.27} fill={fill} stroke={color} strokeWidth={strokeWidth} />;
    } else if (COMPOSITION_STYLES.has(borderStyle)) {
        const side = unit * 0.53;
        shape = (
            <rect
                x={cx - side / 2}
                y={cy - side / 2}
                width={side}
                height={side}
                rx={side * 0.22}
                fill={fill}
                stroke={color}
                strokeWidth={strokeWidth}
            />
        );
    } else if (borderStyle === 'diamond') {
        const d = unit * 0.3;
        shape = (
            <polygon
                points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`}
                fill={fill}
                stroke={color}
                strokeWidth={strokeWidth}
            />
        );
    } else {
        // Hexágono: mesmos vértices do clip-path usado nos nós do board
        const hw = unit * 0.32;
        const hh = unit * 0.28;
        shape = (
            <polygon
                points={`${cx - hw * 0.5},${cy - hh} ${cx + hw * 0.5},${cy - hh} ${cx + hw},${cy} ${cx + hw * 0.5},${cy + hh} ${cx - hw * 0.5},${cy + hh} ${cx - hw},${cy}`}
                fill={fill}
                stroke={color}
                strokeWidth={strokeWidth}
            />
        );
    }

    const glyphSize = unit * 0.3;
    const IconComponent = iconName ? catalog?.[iconName] : undefined;

    return (
        <g opacity={isCompleted ? 0.5 : 1}>
            {shape}
            {IconComponent ? (
                <IconComponent
                    x={cx - glyphSize / 2}
                    y={cy - glyphSize / 2}
                    width={glyphSize}
                    height={glyphSize}
                    color="#ffffff"
                    strokeWidth={2.5}
                />
            ) : name ? (
                <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={unit * 0.3}
                    fontWeight={700}
                    fill="#ffffff"
                >
                    {name.charAt(0).toUpperCase()}
                </text>
            ) : null}
        </g>
    );
};

export const VulcanMiniMap: React.FC = () => {
    const { theme } = useProjectStore();
    const nodes = useNodes();
    const edges = useEdges();

    // O MiniMap do React Flow ignora `children` (confirmado no fonte), então as conexões
    // vão num SVG sobreposto. Em vez de recalcular a projeção, lemos o viewBox real do
    // minimapa e espelhamos — assim os dois ficam sempre no mesmo sistema de coordenadas.
    const [viewBox, setViewBox] = useState<string | null>(null);

    useEffect(() => {
        const svg = document.querySelector('.react-flow__minimap-svg');
        if (!svg) return;

        const sync = () => setViewBox(svg.getAttribute('viewBox'));
        sync();

        const observer = new MutationObserver(sync);
        observer.observe(svg, { attributes: true, attributeFilter: ['viewBox'] });
        return () => observer.disconnect();
    }, []);

    const connections = useMemo(() => {
        const centers = new Map<string, { cx: number; cy: number }>();
        nodes.forEach((n) => {
            if (n.hidden) return;
            centers.set(n.id, nodeCenter(n));
        });

        return edges
            .filter((e) => !e.hidden)
            .map((e) => {
                const from = centers.get(e.source);
                const to = centers.get(e.target);
                if (!from || !to) return null;
                return { id: e.id, from, to };
            })
            .filter((c): c is { id: string; from: { cx: number; cy: number }; to: { cx: number; cy: number } } => c !== null);
    }, [nodes, edges]);

    const edgeColor = theme === 'dark' ? '#ff6a13' : '#ea580c';

    return (
        <>
            <MiniMap
                position="bottom-right"
                zoomable
                pannable
                nodeComponent={MiniMapShape}
                maskColor={theme === 'dark' ? 'rgba(9, 10, 13, 0.72)' : 'rgba(241, 245, 249, 0.62)'}
                bgColor={theme === 'dark' ? '#0c0d10' : '#f8fafc'}
                className="border! border-orange-500/20! rounded-2xl! overflow-hidden shadow-[0_0_25px_rgba(255,106,19,0.15)]! m-3"
            />

            {/* Camada de conexões: mesma caixa e mesmo viewBox do minimapa. A borda transparente
          compensa o 1px de borda do minimapa para os dois SVGs ficarem alinhados. */}
            {viewBox && connections.length > 0 && (
                <Panel
                    position="bottom-right"
                    className="m-3 pointer-events-none border border-transparent rounded-2xl overflow-hidden"
                    style={{ pointerEvents: 'none' }}
                >
                    <svg width={MINIMAP_WIDTH} height={MINIMAP_HEIGHT} viewBox={viewBox} className="overflow-visible">
                        {connections.map(({ id, from, to }) => (
                            <line
                                key={id}
                                x1={from.cx}
                                y1={from.cy}
                                x2={to.cx}
                                y2={to.cy}
                                stroke={edgeColor}
                                strokeWidth={6}
                                strokeLinecap="round"
                                opacity={0.5}
                            />
                        ))}
                    </svg>
                </Panel>
            )}
        </>
    );
};
