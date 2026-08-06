import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { Tag, UnitType, TEMPLATES_BY_LANGUAGE } from './templates';
import { encodeShareUrl, decodeShareUrl } from './shareCodec';

export type ThemeMode = 'dark' | 'light';
export type Language = 'pt' | 'en';
export type ProjectTemplate = 'blank' | 'rpg' | 'budget' | 'cake';

export interface NodeAggregation {
  totalCost: number;
  customUnitsSummary: Record<string, number>;
  hasInputs: boolean;
  inputNodesCount: number;
}

export interface ProgressSummary {
  totalNodes: number;
  completedNodes: number;
  percent: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  quantity: number;
  unitLabel: string | null;
  totalCost: number;
  completed: boolean;
}

export interface ProjectItemsBreakdown {
  all: ProjectItem[];
  remaining: ProjectItem[];
  totalCost: number;
  remainingCost: number;
  hasAnyCost: boolean;
}

// Estilos de borda que representam a "Caixa de Composição": ela é um agrupador,
// não um item de verdade, então é transparente nas listagens e no resumo do hover.
const COMPOSITION_STYLES = new Set(['rounded', 'card', 'square', 'glow', 'dashed']);

function isCompositionNode(node: Node): boolean {
  if (node.type !== 'itemNode') return false;
  const borderStyle = (node.data?.borderStyle as string) || 'circle';
  return COMPOSITION_STYLES.has(borderStyle);
}

// Nós de Processo são uma passagem obrigatória da receita, sem estado de conclusão ou
// custo próprios: nas listagens e travessias eles se comportam como uma Caixa de
// Composição, atravessados em direção aos seus próprios filhos.
function isPassthroughNode(node: Node): boolean {
  return node.type === 'stationNode' || isCompositionNode(node);
}

// Nó de Processo nunca guarda seu próprio "completed": sua aparência de concluído é
// sempre derivada em tempo real do nó acima dele (para o qual ele fornece), atravessando
// outras estações no caminho. Isso evita que ele fique "travado" concluído/pendente
// depois de sucessivos toggles no nó pai, já que ele não tem botão próprio para corrigir.
function isStationEffectivelyCompleted(nodes: Node[], edges: Edge[], nodeId: string): boolean {
  const outgoing = edges.find((e) => e.source === nodeId);
  if (!outgoing) return false;
  const parent = nodes.find((n) => n.id === outgoing.target);
  if (!parent) return false;
  if (parent.type === 'stationNode') return isStationEffectivelyCompleted(nodes, edges, parent.id);
  return !!parent.data?.completed;
}

// Só é chamada para itemNode: Nós de Processo são uma passagem (isPassthroughNode) e nunca chegam aqui.
function describeItem(node: Node, language: Language): ProjectItem {
  const quantity = Number(node.data?.quantity) || 1;
  const unitType = (node.data?.unitType as UnitType) || 'currency';
  const customUnit = (node.data?.customUnit as string)?.trim();
  const baseCost = Number(node.data?.cost) || 0;

  return {
    id: node.id,
    name: (node.data?.name as string)?.trim() || FALLBACK_STRINGS[language].component,
    quantity,
    unitLabel: unitType === 'custom' && customUnit ? customUnit : null,
    totalCost: baseCost * quantity,
    completed: !!node.data?.completed,
  };
}

// Pequenos textos de fallback (quando o dado não tem nome, ou faltou um título) que vivem
// fora de componentes React, então não podem usar o hook useT — resolvidos direto pelo idioma.
const FALLBACK_STRINGS: Record<Language, { component: string; importedProject: string }> = {
  pt: { component: 'Componente', importedProject: 'Projeto Importado' },
  en: { component: 'Component', importedProject: 'Imported Project' },
};

// Travessia recursiva que soma o custo herdado de toda a subárvore abaixo de um nó.
function computeAggregation(
  allNodes: Node[],
  allEdges: Edge[],
  nodeId: string
): NodeAggregation {
  const directEdgeInputs = allEdges.filter((e) => e.target === nodeId);
  const hasInputs = directEdgeInputs.length > 0;
  const inputNodesCount = directEdgeInputs.length;

  if (!hasInputs) {
    return { totalCost: 0, customUnitsSummary: {}, hasInputs, inputNodesCount };
  }

  const visited = new Set<string>();

  const calculateValues = (targetId: string): { cost: number; custom: Record<string, number> } => {
    if (visited.has(targetId)) return { cost: 0, custom: {} };
    visited.add(targetId);

    const incomingEdges = allEdges.filter((e) => e.target === targetId);
    let summedCost = 0;
    const summedCustom: Record<string, number> = {};

    incomingEdges.forEach((e) => {
      const childId = e.source;
      const childNode = allNodes.find((n) => n.id === childId);
      if (!childNode) return;

      const childIncomingEdges = allEdges.filter((edge) => edge.target === childId);
      // Nós de Processo são apenas uma passagem visual/obrigatória: nunca têm custo próprio,
      // só repassam (sem alteração) o que vier somado dos seus próprios filhos.
      let childBaseCost = childNode.type === 'stationNode' ? 0 : Number(childNode.data?.cost) || 0;
      const childQty = Number(childNode.data?.quantity) ?? 1;
      const unitType = (childNode.data?.unitType as UnitType) || 'currency';
      const customUnit = (childNode.data?.customUnit as string)?.trim();

      if (childIncomingEdges.length > 0) {
        // Nó filho é intermediário e também herda dos seus próprios inferiores
        const inherited = calculateValues(childId);
        childBaseCost = inherited.cost;
        Object.entries(inherited.custom).forEach(([unit, count]) => {
          summedCustom[unit] = (summedCustom[unit] || 0) + count * (childNode.type === 'itemNode' ? childQty : 1);
        });
      }

      if (childNode.type === 'itemNode') {
        // Rótulo da unidade: Usa a unidade customizada se preenchida, ou o próprio nome do nó (ex: 2 Stick, 3 Diamante)
        const unitLabel = (unitType === 'custom' && customUnit) ? customUnit : ((childNode.data?.name as string)?.trim() || 'un');

        if (childIncomingEdges.length === 0) {
          summedCustom[unitLabel] = (summedCustom[unitLabel] || 0) + childQty;
        }

        if (childBaseCost > 0) summedCost += childBaseCost * childQty;
      } else if (childNode.type === 'stationNode') {
        if (childBaseCost > 0) summedCost += childBaseCost;
      }
    });

    return { cost: summedCost, custom: summedCustom };
  };

  const result = calculateValues(nodeId);

  return {
    totalCost: result.cost,
    customUnitsSummary: result.custom,
    hasInputs,
    inputNodesCount,
  };
}

export interface ProjectState {
  theme: ThemeMode;
  language: Language;
  projectTitle: string;
  nodes: Node[];
  edges: Edge[];
  tags: Tag[];
  customUnits: string[];
  isViewOnly: boolean;

  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;

  // Idioma da interface (independente do conteúdo já criado pelo usuário)
  setLanguage: (language: Language) => void;

  // Modo de visualização (preview local ou vindo de um link compartilhado como somente-leitura)
  setViewOnly: (value: boolean) => void;

  // Project actions
  setProjectTitle: (title: string) => void;
  loadTemplate: (templateName: ProjectTemplate) => void;
  clearCanvas: () => void;

  // React Flow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node & Edge manipulations
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  updateNodeStyle: (id: string, style: Record<string, unknown>) => void;
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  updateEdgeData: (id: string, label: string) => void;
  deleteEdge: (id: string) => void;

  // Hierarchical Crafting Tree actions
  toggleNodeCollapse: (nodeId: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  getVisibleNodesAndEdges: () => { nodes: Node[]; edges: Edge[] };

  // Conclusão de itens (concluir um nó cascateia para todos os seus filhos)
  toggleNodeCompleted: (nodeId: string) => void;
  // Aparência de "concluído" de um Nó de Processo, sempre derivada do nó pai (nunca armazenada)
  isStationCompleted: (nodeId: string) => boolean;

  // Tag manipulations
  addTag: (name: string, color: string) => Tag;
  updateTag: (id: string, name: string, color: string) => void;
  deleteTag: (id: string) => void;
  
  // Custom Unit manipulations
  addCustomUnit: (unit: string) => void;

  // Calculations & Summaries
  getNodeAggregation: (nodeId: string) => NodeAggregation;
  getProgressSummary: () => ProgressSummary;
  getProjectItemsBreakdown: () => ProjectItemsBreakdown;
  getDirectRemainingItems: (nodeId: string) => ProjectItem[];

  // Sharing & Export
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  exportURL: () => string;
  loadFromURL: (encodedString: string) => boolean;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'pt',
      projectTitle: TEMPLATES_BY_LANGUAGE.pt.blank.title,
      nodes: TEMPLATES_BY_LANGUAGE.pt.blank.nodes,
      edges: TEMPLATES_BY_LANGUAGE.pt.blank.edges,
      tags: TEMPLATES_BY_LANGUAGE.pt.blank.tags,
      customUnits: TEMPLATES_BY_LANGUAGE.pt.blank.customUnits,
      isViewOnly: false,

      setViewOnly: (value) => set({ isViewOnly: value }),

      setLanguage: (language) => set({ language }),

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(nextTheme);
        }
        set({ theme: nextTheme });
      },

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(theme);
        }
        set({ theme });
      },

      setProjectTitle: (projectTitle) => set({ projectTitle }),

      loadTemplate: (templateName) => {
        const templates = TEMPLATES_BY_LANGUAGE[get().language];
        const template = templates[templateName] || templates.blank;
        set({
          projectTitle: template.title,
          nodes: template.nodes,
          edges: template.edges,
          tags: template.tags,
          customUnits: template.customUnits,
        });
      },

      clearCanvas: () => {
        set({
          nodes: [],
          edges: [],
        });
      },

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        const { nodes, edges } = get();
        // Um componente comum só pode alimentar UM pai (uma saída); só o losango pode ter vários
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const isDiamond = sourceNode?.data?.borderStyle === 'diamond';
        const alreadyHasParent = edges.some((e) => e.source === connection.source);
        if (!isDiamond && alreadyHasParent) return;

        const newEdge = {
          ...connection,
          type: 'customEdge',
          animated: true,
          data: { label: '' },
        };
        set({
          edges: addEdge(newEdge, edges),
        });
      },

      addNode: (node) => {
        set({
          nodes: [...get().nodes, node],
        });
      },

      updateNodeData: (id, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              };
            }
            return node;
          }),
        });
      },

      updateNodeStyle: (id, style) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                style: {
                  ...node.style,
                  ...style,
                },
              };
            }
            return node;
          }),
        });
      },

      updateNodeProps: (id, props) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                ...props,
              };
            }
            return node;
          }),
        });
      },

      deleteNode: (id) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id && n.parentId !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
        });
      },

      updateEdgeData: (id, label) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  label,
                },
              };
            }
            return edge;
          }),
        });
      },

      deleteEdge: (id) => {
        set({
          edges: get().edges.filter((e) => e.id !== id),
        });
      },

      // HIERARQUIA DE CRAFTING TREES (COLAPSAR & EXPANDIR)
      toggleNodeCollapse: (nodeId: string) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (node) {
          const currentlyCollapsed = !!node.data?.collapsed;
          get().updateNodeData(nodeId, { collapsed: !currentlyCollapsed });
        }
      },

      collapseAll: () => {
        const nextNodes = get().nodes.map((n) => {
          const hasChildren = get().edges.some((e) => e.target === n.id);
          if (hasChildren) {
            return { ...n, data: { ...n.data, collapsed: true } };
          }
          return n;
        });
        set({ nodes: nextNodes });
      },

      expandAll: () => {
        const nextNodes = get().nodes.map((n) => ({
          ...n,
          data: { ...n.data, collapsed: false },
        }));
        set({ nodes: nextNodes });
      },

      getVisibleNodesAndEdges: () => {
        const { nodes, edges } = get();
        const hiddenNodeIds = new Set<string>();

        // Encontra todos os nós que possuem collapsed = true e oculta seus descendentes em cascata
        const collapsedRoots = nodes.filter((n) => !!n.data?.collapsed).map((n) => n.id);

        const hideChildrenRecursively = (parentId: string) => {
          edges.forEach((e) => {
            if (e.target === parentId && !hiddenNodeIds.has(e.source)) {
              hiddenNodeIds.add(e.source);
              hideChildrenRecursively(e.source);
            }
          });
        };

        collapsedRoots.forEach((id) => hideChildrenRecursively(id));

        const visibleNodes = nodes.map((n) => ({
          ...n,
          hidden: hiddenNodeIds.has(n.id),
        }));

        const visibleEdges = edges.map((e) => ({
          ...e,
          hidden: hiddenNodeIds.has(e.source) || hiddenNodeIds.has(e.target),
        }));

        return { nodes: visibleNodes, edges: visibleEdges };
      },

      // Marcar como concluído cascateia para BAIXO (todos os descendentes: filhos, netos, etc.).
      // Desmarcar cascateia para CIMA (todos os pais diretos e indiretos que dependiam deste nó),
      // já que um pai não pode continuar "concluído" se um dos seus ingredientes deixou de estar pronto.
      toggleNodeCompleted: (nodeId: string) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (!node) return;
        const nextCompleted = !node.data?.completed;
        const edges = get().edges;

        if (!nextCompleted) {
          const idsToUncomplete = new Set<string>([nodeId]);
          const collectAncestors = (id: string) => {
            edges.forEach((e) => {
              if (e.source === id && !idsToUncomplete.has(e.target)) {
                idsToUncomplete.add(e.target);
                collectAncestors(e.target);
              }
            });
          };
          collectAncestors(nodeId);

          set({
            // Nós de Processo nunca armazenam o próprio "completed" (ver isStationEffectivelyCompleted);
            // eles só continuam no meio do caminho da travessia acima, sem receber a escrita.
            nodes: get().nodes.map((n) =>
              idsToUncomplete.has(n.id) && n.type !== 'stationNode' ? { ...n, data: { ...n.data, completed: false } } : n
            ),
          });
          return;
        }

        const idsToComplete = new Set<string>([nodeId]);
        const collectDescendants = (id: string) => {
          edges.forEach((e) => {
            if (e.target === id && !idsToComplete.has(e.source)) {
              idsToComplete.add(e.source);
              collectDescendants(e.source);
            }
          });
        };
        collectDescendants(nodeId);

        set({
          nodes: get().nodes.map((n) =>
            idsToComplete.has(n.id) && n.type !== 'stationNode' ? { ...n, data: { ...n.data, completed: true } } : n
          ),
        });
      },

      addTag: (name, color) => {
        const newTag: Tag = {
          id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name,
          color,
        };
        set({
          tags: [...get().tags, newTag],
        });
        return newTag;
      },

      updateTag: (id, name, color) => {
        set({
          tags: get().tags.map((t) => (t.id === id ? { ...t, name, color } : t)),
        });
      },

      deleteTag: (id) => {
        set({
          tags: get().tags.filter((t) => t.id !== id),
        });
      },

      addCustomUnit: (unit) => {
        if (!unit) return;
        const current = get().customUnits;
        if (!current.includes(unit)) {
          set({ customUnits: [...current, unit] });
        }
      },

      getNodeAggregation: (nodeId: string): NodeAggregation => {
        return computeAggregation(get().nodes, get().edges, nodeId);
      },

      isStationCompleted: (nodeId: string): boolean => {
        return isStationEffectivelyCompleted(get().nodes, get().edges, nodeId);
      },

      // Progresso da árvore por contagem de nós concluídos (inclui composições:
      // elas também precisam ser marcadas para a árvore estar realmente pronta).
      // Nós de Processo ficam de fora: são só uma passagem obrigatória, sem estado próprio.
      getProgressSummary: (): ProgressSummary => {
        const relevant = get().nodes.filter((n) => n.type === 'itemNode');
        const totalNodes = relevant.length;
        const completedNodes = relevant.filter((n) => !!n.data?.completed).length;
        return {
          totalNodes,
          completedNodes,
          percent: totalNodes === 0 ? 0 : Math.round((completedNodes / totalNodes) * 100),
        };
      },

      // Listagem plana para o card de detalhes do progresso. Composições e Nós de Processo
      // ficam de fora por serem apenas agrupadores/passagem (custo e estado próprios
      // inexistentes), então somar a lista exibida bate exatamente com o total do rodapé.
      getProjectItemsBreakdown: (): ProjectItemsBreakdown => {
        const language = get().language;
        const all = get()
          .nodes.filter((n) => n.type === 'itemNode' && !isCompositionNode(n))
          .map((n) => describeItem(n, language));

        const remaining = all.filter((i) => !i.completed);
        const totalCost = all.reduce((sum, i) => sum + i.totalCost, 0);
        const remainingCost = remaining.reduce((sum, i) => sum + i.totalCost, 0);

        return {
          all,
          remaining,
          totalCost,
          remainingCost,
          hasAnyCost: all.some((i) => i.totalCost > 0),
        };
      },

      // Itens pendentes da linha imediatamente abaixo do nó. Composições são
      // atravessadas (descemos para os filhos delas) sem entrar na lista, já que
      // representam um agrupamento e não um item a ser obtido.
      getDirectRemainingItems: (nodeId: string): ProjectItem[] => {
        const { nodes, edges, language } = get();
        const visited = new Set<string>([nodeId]);
        const result: ProjectItem[] = [];

        const collectFrom = (parentId: string) => {
          edges
            .filter((e) => e.target === parentId)
            .forEach((e) => {
              if (visited.has(e.source)) return;
              visited.add(e.source);

              const child = nodes.find((n) => n.id === e.source);
              if (!child) return;

              if (isPassthroughNode(child)) {
                collectFrom(child.id);
                return;
              }
              if (!child.data?.completed) result.push(describeItem(child, language));
            });
        };

        collectFrom(nodeId);
        return result;
      },

      exportJSON: () => {
        const state = get();
        return JSON.stringify({
          version: '2.0-crafting-tree',
          title: state.projectTitle,
          nodes: state.nodes,
          edges: state.edges,
          tags: state.tags,
          customUnits: state.customUnits,
        }, null, 2);
      },

      importJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed && Array.isArray(parsed.nodes)) {
            set({
              projectTitle: parsed.title || FALLBACK_STRINGS[get().language].importedProject,
              nodes: parsed.nodes || [],
              edges: parsed.edges || [],
              tags: parsed.tags || TEMPLATES_BY_LANGUAGE[get().language].blank.tags,
              customUnits: parsed.customUnits || [],
            });
            return true;
          }
          return false;
        } catch (e) {
          console.error('Falha ao importar JSON:', e);
          return false;
        }
      },

      exportURL: () => {
        const state = get();
        return encodeShareUrl({
          projectTitle: state.projectTitle,
          nodes: state.nodes,
          edges: state.edges,
          tags: state.tags,
          customUnits: state.customUnits,
        });
      },

      loadFromURL: (encodedString) => {
        const payload = decodeShareUrl(encodedString);
        if (!payload) return false;

        set({
          projectTitle: payload.projectTitle,
          nodes: payload.nodes,
          edges: payload.edges,
          tags: payload.tags.length > 0 ? payload.tags : TEMPLATES_BY_LANGUAGE[get().language].blank.tags,
          customUnits: payload.customUnits,
        });
        return true;
      },
    }),
    {
      name: 'vulcanode-project',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        projectTitle: state.projectTitle,
        nodes: state.nodes,
        edges: state.edges,
        tags: state.tags,
        customUnits: state.customUnits,
      }),
    }
  )
);
