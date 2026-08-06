import { LanguageDict } from '../useT';

export interface EditModalDict {
  editProcessTitle: string;
  editComponentTitle: string;
  editModalDescription: string;
  changeIconTitle: string;
  iconColorLabel: string;
  iconColorTitle: string;
  resetIconColorTitle: string;
  shapeCircle: string;
  shapeComposition: string;
  shapeGoal: string;
  shapeHexagon: string;
  unitCurrency: string;
  unitCustom: string;
  unitNone: string;
  namePlaceholderProcess: string;
  namePlaceholderComponent: string;
  subtitlePlaceholder: string;
  descriptionPlaceholder: string;
  urlPlaceholder: string;
  valueLabel: string;
  qtyLabel: string;
  unitCostLabel: string;
  costPlaceholder: string;
  unitLabel: string;
  customUnitPlaceholder: string;
  tagLabel: string;
  cancelTag: string;
  newTag: string;
  tagNamePlaceholder: string;
  createButton: string;
  doneButton: string;
  selectIconTitle: string;
  iconsAvailableSuffix: string;
  loadingCatalog: string;
  searchIconPlaceholder: string;
  clearSearchTitle: string;
  loadingIcons: string;
  noIconsFoundPrefix: string;
  noIconTitle: string;
  showingPrefix: string;
  showingOfWord: string;
  showingSuffix: string;
}

export const editModalDict: LanguageDict<EditModalDict> = {
  pt: {
    editProcessTitle: 'Editar Processo',
    editComponentTitle: 'Editar Componente',
    editModalDescription: 'As alterações são aplicadas na árvore em tempo real.',
    changeIconTitle: 'Trocar ícone',
    iconColorLabel: 'Cor do Ícone',
    iconColorTitle: 'Cor personalizada do ícone (independe da tag)',
    resetIconColorTitle: 'Restaurar cor padrão do ícone',
    shapeCircle: 'Círculo',
    shapeComposition: 'Composição',
    shapeGoal: 'Meta',
    shapeHexagon: 'Hexágono',
    unitCurrency: '$',
    unitCustom: 'Un',
    unitNone: '—',
    namePlaceholderProcess: 'Nome do processo',
    namePlaceholderComponent: 'Nome do componente',
    subtitlePlaceholder: 'Subtítulo (opcional)',
    descriptionPlaceholder: 'Descrição exibida no card de detalhes',
    urlPlaceholder: 'https://... (opcional)',
    valueLabel: 'Valor',
    qtyLabel: 'Qtd',
    unitCostLabel: 'Custo unitário',
    costPlaceholder: '0,00',
    unitLabel: 'Unidade',
    customUnitPlaceholder: 'barras, kg, pçs...',
    tagLabel: 'Tag',
    cancelTag: 'Cancelar',
    newTag: '+ Nova',
    tagNamePlaceholder: 'Nome da tag...',
    createButton: 'Criar',
    doneButton: 'Concluir',
    selectIconTitle: 'Selecionar Ícone',
    iconsAvailableSuffix: 'ícones da Lucide disponíveis.',
    loadingCatalog: 'Carregando catálogo…',
    searchIconPlaceholder: 'Buscar por nome (ex: sword, flame, home...)',
    clearSearchTitle: 'Limpar busca',
    loadingIcons: 'Carregando ícones…',
    noIconsFoundPrefix: 'Nenhum ícone encontrado para',
    noIconTitle: 'Sem ícone (exibir apenas o nome)',
    showingPrefix: 'Mostrando',
    showingOfWord: 'de',
    showingSuffix: 'refine a busca para ver os demais.',
  },
  en: {
    editProcessTitle: 'Edit Process',
    editComponentTitle: 'Edit Component',
    editModalDescription: 'Changes are applied to the tree in real time.',
    changeIconTitle: 'Change icon',
    iconColorLabel: 'Icon Color',
    iconColorTitle: 'Custom icon color (independent of the tag)',
    resetIconColorTitle: 'Reset icon color to default',
    shapeCircle: 'Circle',
    shapeComposition: 'Composition',
    shapeGoal: 'Goal',
    shapeHexagon: 'Hexagon',
    unitCurrency: '$',
    unitCustom: 'Unit',
    unitNone: '—',
    namePlaceholderProcess: 'Process name',
    namePlaceholderComponent: 'Component name',
    subtitlePlaceholder: 'Subtitle (optional)',
    descriptionPlaceholder: 'Description shown on the detail card',
    urlPlaceholder: 'https://... (optional)',
    valueLabel: 'Value',
    qtyLabel: 'Qty',
    unitCostLabel: 'Unit cost',
    costPlaceholder: '0.00',
    unitLabel: 'Unit',
    customUnitPlaceholder: 'bars, kg, pcs...',
    tagLabel: 'Tag',
    cancelTag: 'Cancel',
    newTag: '+ New',
    tagNamePlaceholder: 'Tag name...',
    createButton: 'Create',
    doneButton: 'Done',
    selectIconTitle: 'Select Icon',
    iconsAvailableSuffix: 'Lucide icons available.',
    loadingCatalog: 'Loading catalog…',
    searchIconPlaceholder: 'Search by name (e.g. sword, flame, home...)',
    clearSearchTitle: 'Clear search',
    loadingIcons: 'Loading icons…',
    noIconsFoundPrefix: 'No icons found for',
    noIconTitle: 'No icon (show name only)',
    showingPrefix: 'Showing',
    showingOfWord: 'of',
    showingSuffix: 'refine your search to see the rest.',
  },
};
