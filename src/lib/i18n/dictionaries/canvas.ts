import { LanguageDict } from '../useT';

export interface CanvasDict {
  editMode: string;
  viewMode: string;
  switchToEditModeTitle: string;
  switchToViewModeTitle: string;
  centerAndFitTitle: string;
  labelPlaceholder: string;
  saveLabelTitle: string;
  editLabelTitle: string;
  removeConnectionTitle: string;
  addLabelTitle: string;
  removeEdgeTitle: string;
}

export const canvasDict: LanguageDict<CanvasDict> = {
  pt: {
    editMode: 'Editar',
    viewMode: 'Visualizar',
    switchToEditModeTitle: 'Alternar para modo de Edição',
    switchToViewModeTitle: 'Alternar para modo de Visualização',
    centerAndFitTitle: 'Centralizar e enquadrar toda a árvore',
    labelPlaceholder: 'Ex: 5 barras, 2 kg...',
    saveLabelTitle: 'Salvar rótulo da conexão',
    editLabelTitle: 'Clique para editar rótulo',
    removeConnectionTitle: 'Remover conexão',
    addLabelTitle: 'Adicionar rótulo/quantidade à linha de conexão',
    removeEdgeTitle: 'Remover linha de conexão',
  },
  en: {
    editMode: 'Edit',
    viewMode: 'View',
    switchToEditModeTitle: 'Switch to Edit mode',
    switchToViewModeTitle: 'Switch to View mode',
    centerAndFitTitle: 'Center and fit the entire tree',
    labelPlaceholder: 'E.g.: 5 bars, 2 kg...',
    saveLabelTitle: 'Save connection label',
    editLabelTitle: 'Click to edit label',
    removeConnectionTitle: 'Remove connection',
    addLabelTitle: 'Add label/quantity to the connection line',
    removeEdgeTitle: 'Remove connection line',
  },
};
