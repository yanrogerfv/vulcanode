import { LanguageDict } from '../useT';

export interface NodeDict {
  defaultComponentName: string;
  defaultStationName: string;
  defaultStationSubtitle: string;
  expandChildrenTitle: string;
  collapseChildrenTitle: string;
  allDone: string;
  missing: string;
  markAsPending: string;
  markAsCompleted: string;
  childrenSum: string;
  costQuantity: string;
  uniqueComponent: string;
  unitAbbreviation: string;
  inheritedValueNote: string;
  accessLinkedLink: string;
  noDescriptionComponent: string;
  removeComponentTitle: string;
  remove: string;
  editComponentTitle: string;
  editComponent: string;
  noDescriptionStation: string;
  accessProcessLink: string;
  removeStationTitle: string;
  editStationTitle: string;
  editStation: string;
}

export const nodeDict: LanguageDict<NodeDict> = {
  pt: {
    defaultComponentName: 'Novo Componente',
    defaultStationName: 'Novo Processo / Estação',
    defaultStationSubtitle: 'Passagem de Tempo / Estação',
    expandChildrenTitle: 'Clique para Expandir Filhos',
    collapseChildrenTitle: 'Clique para Colapsar Filhos',
    allDone: 'Tudo Pronto!',
    missing: 'Falta:',
    markAsPending: 'Marcar como Pendente',
    markAsCompleted: 'Marcar como Concluído',
    childrenSum: 'Soma dos Filhos:',
    costQuantity: 'Custo / Quantidade:',
    uniqueComponent: 'Componente Único',
    unitAbbreviation: 'un',
    inheritedValueNote: '* Valor herdado da soma de todos os componentes conectados abaixo.',
    accessLinkedLink: 'Acessar Link Associado',
    noDescriptionComponent: 'Nenhuma descrição. Clique no botão de lápis para detalhar este componente.',
    removeComponentTitle: 'Excluir Componente',
    remove: 'Remover',
    editComponentTitle: 'Editar Propriedades do Componente',
    editComponent: 'Editar Componente',
    noDescriptionStation: 'Este nó demonstra uma passagem obrigatória de tempo ou estação de transformação da receita.',
    accessProcessLink: 'Acessar Link do Processo',
    removeStationTitle: 'Excluir Processo',
    editStationTitle: 'Editar Processo / Borda',
    editStation: 'Editar Processo',
  },
  en: {
    defaultComponentName: 'New Component',
    defaultStationName: 'New Process / Station',
    defaultStationSubtitle: 'Time Passage / Station',
    expandChildrenTitle: 'Click to Expand Children',
    collapseChildrenTitle: 'Click to Collapse Children',
    allDone: 'All Done!',
    missing: 'Missing:',
    markAsPending: 'Mark as Pending',
    markAsCompleted: 'Mark as Completed',
    childrenSum: 'Sum of Children:',
    costQuantity: 'Cost / Quantity:',
    uniqueComponent: 'Unique Component',
    unitAbbreviation: 'unit',
    inheritedValueNote: '* Value inherited from the sum of all components connected below.',
    accessLinkedLink: 'Open Linked URL',
    noDescriptionComponent: 'No description. Click the pencil button to add details to this component.',
    removeComponentTitle: 'Delete Component',
    remove: 'Remove',
    editComponentTitle: 'Edit Component Properties',
    editComponent: 'Edit Component',
    noDescriptionStation: 'This node represents a mandatory time passage or transformation station in the recipe.',
    accessProcessLink: 'Open Process Link',
    removeStationTitle: 'Delete Process',
    editStationTitle: 'Edit Process / Border',
    editStation: 'Edit Process',
  },
};
