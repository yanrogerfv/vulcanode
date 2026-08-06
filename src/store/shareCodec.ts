import LZString from 'lz-string';
import { Node, Edge } from '@xyflow/react';
import { Tag } from './templates';

export interface SharePayload {
  projectTitle: string;
  nodes: Node[];
  edges: Edge[];
  tags: Tag[];
  customUnits: string[];
}

/**
 * Codec do link de compartilhamento.
 *
 * O formato antigo serializava os nós crus, o que levava para a URL um monte de coisa
 * desnecessária: campos de runtime que o React Flow injeta (`selected`, `dragging`,
 * `measured`), ids longos gerados por timestamp, valores em seus defaults e chaves
 * com nome completo. Aqui tudo isso sai:
 *
 * - ids viram índices de array (as arestas passam a referenciar posições)
 * - `type` vira código numérico e `position` vira par [x, y] arredondado
 * - chaves de `data` são abreviadas e campos em valor default são omitidos
 * - tags são referenciadas por índice
 *
 * O JSON de backup (exportJSON) segue com fidelidade total — lá tamanho não importa.
 */
const SHARE_FORMAT_VERSION = 3;

const NODE_TYPES = ['itemNode', 'stationNode'] as const;
type KnownNodeType = (typeof NODE_TYPES)[number];

const DEFAULT_BORDER_STYLE: Record<KnownNodeType, string> = {
  itemNode: 'circle',
  stationNode: 'hexagon',
};

/**
 * Campos de `data` que entram no link, com suas chaves curtas.
 * Um campo novo só é compartilhado se for adicionado aqui.
 */
const DATA_KEYS = {
  name: 'n',
  subtitle: 's',
  description: 'd',
  url: 'u',
  icon: 'i',
  quantity: 'q',
  cost: 'c',
  unitType: 'ut',
  customUnit: 'cu',
  borderStyle: 'b',
  collapsed: 'cl',
  completed: 'cp',
  processingCost: 'pc',
  iconColor: 'ic',
} as const;

type CompactData = Record<string, string | number | boolean>;
type CompactNode = [number, number, number, CompactData];
type CompactEdge = [number, number] | [number, number, string];

interface CompactProject {
  v: number;
  t: string;
  tg: [string, string][];
  cu: string[];
  n: CompactNode[];
  e: CompactEdge[];
  /** índice da tag de cada nó, só para os nós que têm tag */
  nt?: Record<number, number>;
}

function nodeTypeCode(type: string | undefined): number {
  const index = NODE_TYPES.indexOf(type as KnownNodeType);
  return index === -1 ? 0 : index;
}

export function encodeShareUrl(state: SharePayload): string {
  const nodeIndexById = new Map<string, number>();
  state.nodes.forEach((node, index) => nodeIndexById.set(node.id, index));

  const tagIndexById = new Map<string, number>();
  state.tags.forEach((tag, index) => tagIndexById.set(tag.id, index));

  const nodeTags: Record<number, number> = {};

  const n: CompactNode[] = state.nodes.map((node, index) => {
    const data = (node.data || {}) as Record<string, unknown>;
    const type = (node.type as KnownNodeType) || 'itemNode';
    const compact: CompactData = {};

    // Textos: só entram se tiverem conteúdo
    (['name', 'subtitle', 'description', 'url', 'icon', 'customUnit', 'iconColor'] as const).forEach((field) => {
      const value = typeof data[field] === 'string' ? (data[field] as string).trim() : '';
      if (value) compact[DATA_KEYS[field]] = value;
    });

    // Números: só entram se diferirem do default
    const quantity = Number(data.quantity);
    if (Number.isFinite(quantity) && quantity !== 1) compact[DATA_KEYS.quantity] = quantity;

    const cost = Number(data.cost);
    if (Number.isFinite(cost) && cost !== 0) compact[DATA_KEYS.cost] = cost;

    const processingCost = Number(data.processingCost);
    if (Number.isFinite(processingCost) && processingCost !== 0) {
      compact[DATA_KEYS.processingCost] = processingCost;
    }

    if (data.unitType && data.unitType !== 'currency') {
      compact[DATA_KEYS.unitType] = data.unitType as string;
    }

    const borderStyle = data.borderStyle as string | undefined;
    if (borderStyle && borderStyle !== DEFAULT_BORDER_STYLE[type]) {
      compact[DATA_KEYS.borderStyle] = borderStyle;
    }

    if (data.collapsed) compact[DATA_KEYS.collapsed] = 1;
    if (data.completed) compact[DATA_KEYS.completed] = 1;

    const tagIndex = tagIndexById.get((data.tagId as string) || '');
    if (tagIndex !== undefined) nodeTags[index] = tagIndex;

    return [
      nodeTypeCode(node.type),
      Math.round(node.position?.x ?? 0),
      Math.round(node.position?.y ?? 0),
      compact,
    ];
  });

  const e: CompactEdge[] = [];
  state.edges.forEach((edge) => {
    const source = nodeIndexById.get(edge.source);
    const target = nodeIndexById.get(edge.target);
    if (source === undefined || target === undefined) return;

    const label = typeof edge.data?.label === 'string' ? edge.data.label.trim() : '';
    e.push(label ? [source, target, label] : [source, target]);
  });

  const payload: CompactProject = {
    v: SHARE_FORMAT_VERSION,
    t: state.projectTitle,
    tg: state.tags.map((tag) => [tag.name, tag.color]),
    cu: state.customUnits,
    n,
    e,
  };
  if (Object.keys(nodeTags).length > 0) payload.nt = nodeTags;

  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

function decodeCompact(payload: CompactProject): SharePayload {
  const tags: Tag[] = (payload.tg || []).map(([name, color], index) => ({
    id: `t-shared-${index}`,
    name,
    color,
  }));

  const nodes: Node[] = (payload.n || []).map(([typeCode, x, y, compact], index) => {
    const type = NODE_TYPES[typeCode] ?? 'itemNode';
    const data = compact || {};
    const tagIndex = payload.nt?.[index];

    return {
      id: `n${index}`,
      type,
      position: { x, y },
      data: {
        name: (data[DATA_KEYS.name] as string) ?? '',
        subtitle: (data[DATA_KEYS.subtitle] as string) ?? '',
        description: (data[DATA_KEYS.description] as string) ?? '',
        url: (data[DATA_KEYS.url] as string) ?? '',
        icon: (data[DATA_KEYS.icon] as string) ?? '',
        iconColor: (data[DATA_KEYS.iconColor] as string) ?? '',
        quantity: (data[DATA_KEYS.quantity] as number) ?? 1,
        cost: (data[DATA_KEYS.cost] as number) ?? 0,
        processingCost: (data[DATA_KEYS.processingCost] as number) ?? 0,
        unitType: (data[DATA_KEYS.unitType] as string) ?? 'currency',
        customUnit: (data[DATA_KEYS.customUnit] as string) ?? '',
        borderStyle: (data[DATA_KEYS.borderStyle] as string) ?? DEFAULT_BORDER_STYLE[type],
        tagId: tagIndex !== undefined ? tags[tagIndex]?.id ?? '' : '',
        collapsed: !!data[DATA_KEYS.collapsed],
        completed: !!data[DATA_KEYS.completed],
      },
    };
  });

  const edges: Edge[] = (payload.e || [])
    .filter(([source, target]) => nodes[source] && nodes[target])
    .map(([source, target, label], index) => ({
      id: `e${index}`,
      source: nodes[source].id,
      target: nodes[target].id,
      type: 'customEdge',
      animated: true,
      data: { label: label ?? '' },
    }));

  return {
    projectTitle: payload.t || 'Projeto Compartilhado',
    nodes,
    edges,
    tags,
    customUnits: payload.cu || [],
  };
}

/** Formato anterior (nós crus). Mantido para não quebrar links já gerados. */
interface LegacyProject {
  t?: string;
  n?: Node[];
  e?: Edge[];
  tg?: Tag[];
  cu?: string[];
}

function decodeLegacy(payload: LegacyProject): SharePayload {
  return {
    projectTitle: payload.t || 'Projeto Compartilhado',
    nodes: payload.n || [],
    edges: payload.e || [],
    tags: payload.tg || [],
    customUnits: payload.cu || [],
  };
}

export function decodeShareUrl(encoded: string): SharePayload | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    if (!parsed || !Array.isArray(parsed.n)) return null;

    return parsed.v === SHARE_FORMAT_VERSION
      ? decodeCompact(parsed as CompactProject)
      : decodeLegacy(parsed as LegacyProject);
  } catch (error) {
    console.error('Falha ao decodificar o link compartilhado:', error);
    return null;
  }
}
