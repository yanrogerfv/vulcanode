import React, { useCallback, useRef, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useReactFlow,
    Node,
    Edge,
} from '@xyflow/react';
import { Eye, Pencil, Crosshair } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { VulcanMiniMap } from '@/components/canvas/VulcanMiniMap';
import { ItemNode } from '@/components/nodes/ItemNode';
import { StationNode } from '@/components/nodes/StationNode';
import { CustomEdge } from '@/components/edges/CustomEdge';
import { useT } from '@/lib/i18n/useT';
import { canvasDict } from '@/lib/i18n/dictionaries/canvas';

const nodeTypes = {
    itemNode: ItemNode,
    stationNode: StationNode,
};

const edgeTypes = {
    customEdge: CustomEdge,
};

// Passo da grid e largura fixa dos nós. A largura precisa bater com a do wrapper em
// ItemNode/StationNode (w-[150px]): é ela que garante que o conector (centralizado em 50%)
// caia sempre no mesmo ponto, permitindo linhas perfeitamente retas entre nós na mesma coluna.
const SNAP_SIZE = 15;
const NODE_WIDTH = 150;

export const VulcanCanvas: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, fitView } = useReactFlow();

    const {
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        deleteEdge,
        theme,
        loadFromURL,
        getVisibleNodesAndEdges,
        isViewOnly,
        setViewOnly
    } = useProjectStore();

    const t = useT(canvasDict);
    const { nodes: visibleNodes, edges: visibleEdges } = getVisibleNodesAndEdges();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const shareHash = urlParams.get('share');
            if (shareHash) {
                loadFromURL(shareHash);
                if (urlParams.get('mode') === 'view') {
                    setViewOnly(true);
                }
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [loadFromURL, setViewOnly]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            if (isViewOnly) return;

            const type = event.dataTransfer.getData('application/reactflow-type');
            const defaultName = event.dataTransfer.getData('application/reactflow-name');
            const defaultShape = event.dataTransfer.getData('application/reactflow-shape');
            const defaultIcon = event.dataTransfer.getData('application/reactflow-icon');

            if (!type) return;

            const rawPosition = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // snapGrid do React Flow só age durante o arraste; no drop precisamos alinhar manualmente,
            // senão o nó novo nasce fora da grid e seus conectores nunca alinham com os demais.
            const position = {
                x: Math.round((rawPosition.x - NODE_WIDTH / 2) / SNAP_SIZE) * SNAP_SIZE,
                y: Math.round(rawPosition.y / SNAP_SIZE) * SNAP_SIZE,
            };

            let chosenBorderStyle = defaultShape || 'rounded';
            if (!defaultShape) {
                if (type === 'stationNode') chosenBorderStyle = 'hexagon';
                else if (type === 'itemNode') chosenBorderStyle = 'circle';
            }

            const newNode: Node = {
                id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                type,
                position,
                data: {
                    name: defaultName || 'Novo Componente',
                    icon: defaultIcon || (type === 'stationNode' ? 'Flame' : 'Box'),
                    quantity: 1,
                    cost: 0,
                    unitType: 'currency',
                    customUnit: '',
                    borderStyle: chosenBorderStyle,
                    collapsed: false,
                },
            };

            addNode(newNode);
        },
        [screenToFlowPosition, addNode, isViewOnly]
    );

    const handleEdgeDoubleClick = useCallback(
        (event: React.MouseEvent, edge: Edge) => {
            if (isViewOnly) return;
            event.preventDefault();
            event.stopPropagation();
            deleteEdge(edge.id);
        },
        [deleteEdge, isViewOnly]
    );

    return (
        <div ref={reactFlowWrapper} className="flex-1 h-full w-full bg-canvas-bg relative overflow-hidden font-sans">
            {/* CONTROLES FLUTUANTES - camada acima do board, canto superior direito */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                <button
                    onClick={() => fitView({ padding: 0.2, duration: 400 })}
                    title={t('centerAndFitTitle')}
                    className="h-9 w-9 flex items-center justify-center bg-card/95 border border-border/80 rounded-xl shadow-2xl backdrop-blur-md text-foreground/80 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50 hover:cursor-pointer transition-colors"
                >
                    <Crosshair className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 bg-card/95 border border-border/80 rounded-xl p-1 shadow-2xl backdrop-blur-md">
                    <button
                        onClick={() => setViewOnly(false)}
                        title={t('switchToEditModeTitle')}
                        className={`h-7 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${!isViewOnly ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>{t('editMode')}</span>
                    </button>
                    <button
                        onClick={() => setViewOnly(true)}
                        title={t('switchToViewModeTitle')}
                        className={`h-7 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${isViewOnly ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('viewMode')}</span>
                    </button>
                </div>
            </div>

            <ReactFlow
                nodes={visibleNodes}
                edges={visibleEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onEdgeDoubleClick={handleEdgeDoubleClick}
                deleteKeyCode={isViewOnly ? null : ['Backspace', 'Delete']}
                nodesDraggable={!isViewOnly}
                nodesConnectable={!isViewOnly}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                snapToGrid
                snapGrid={[SNAP_SIZE, SNAP_SIZE]}
                defaultEdgeOptions={{ type: 'customEdge', animated: true }}
                proOptions={{ hideAttribution: true }}
                colorMode={theme}
            >
                <Background
                    color={theme === 'dark' ? '#ff6a13' : '#ea580c'}
                    gap={24}
                    size={1.5}
                    className="opacity-20 dark:opacity-25"
                />
                {/* <Controls
                    className="!border !border-border !shadow-2xl !rounded-xl overflow-hidden"
                    style={{
                        // Sem colorMode, a .react-flow interna assume .light por padrão (independente do
                        // nosso tema), o que reintroduz --card/--foreground claros para tudo dentro do canvas
                        // (efeito shadowing de custom property). colorMode acima corrige a raiz; aqui só
                        // garantimos que os botões usem exatamente nossa paleta em vez dos tons padrão da lib.
                        ['--xy-controls-button-background-color' as string]: 'var(--card)',
                        ['--xy-controls-button-background-color-hover' as string]: 'var(--accent)',
                        ['--xy-controls-button-color' as string]: 'var(--foreground)',
                        ['--xy-controls-button-color-hover' as string]: 'var(--foreground)',
                        ['--xy-controls-button-border-color' as string]: 'var(--border)',
                    } as React.CSSProperties}
                /> */}
                <VulcanMiniMap />
            </ReactFlow>
        </div>
    );
};

