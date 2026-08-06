import { LanguageDict } from '../useT';

export interface HeaderDict {
  renameProject: string;
  newCraftingTree: string;
  collapseAllTitle: string;
  collapseAll: string;
  expandAllTitle: string;
  expandAll: string;
  treeProgress: string;
  remainingColumn: string;
  summaryColumn: string;
  noComponentsYet: string;
  allDone: string;
  left: string;
  total: string;
  switchToLightTheme: string;
  switchToDarkTheme: string;
  switchToPortuguese: string;
  switchToEnglish: string;
  downloadPng: string;
  downloadJson: string;
  shareProject: string;
  copied: string;
  share: string;
  shareEditable: string;
  shareEditableDesc: string;
  shareViewOnly: string;
  shareViewOnlyDesc: string;
  clearCanvas: string;
  yesClear: string;
  confirmNewProjectTitle: string;
  confirmNewProjectDesc: string;
  confirmNewProjectBodyPrefix: string;
  confirmNewProjectBodyHas: string;
  componentSingular: string;
  componentPlural: string;
  confirmNewProjectBodyOverwritten: string;
  confirmNewProjectBodyLostIntro: string;
  confirmNewProjectBodyLostList: string;
  confirmNewProjectBodyBackupHint: string;
  jsonWord: string;
  cancel: string;
  yesCreateNew: string;
  performanceWarningTitle: string;
  performanceWarningDesc: string;
  performanceWarningBodyPrefix: string;
  componentsWord: string;
  performanceWarningBodySuffix: string;
  performanceWarningQuestion: string;
  yesExpandAll: string;
  goHomeTitle: string;
  goHomeIconTitle: string;
  goHomeDesc: string;
  goHomeBodyPrefix: string;
  goHomeBodySuffix: string;
  yesGoHome: string;
}

export const headerDict: LanguageDict<HeaderDict> = {
  pt: {
    renameProject: 'Clique para renomear o projeto',
    newCraftingTree: 'Criar nova Crafting Tree',
    collapseAllTitle: 'Colapsar todas as ramificações de componentes na árvore',
    collapseAll: 'Colapsar Todos',
    expandAllTitle: 'Expandir todas as ramificações de componentes',
    expandAll: 'Expandir Todos',
    treeProgress: 'Progresso da árvore',
    remainingColumn: 'Restante',
    summaryColumn: 'Resumo',
    noComponentsYet: 'Nenhum componente ainda',
    allDone: 'Tudo concluído!',
    left: 'Falta',
    total: 'Total',
    switchToLightTheme: 'Mudar para Tema Claro',
    switchToDarkTheme: 'Mudar para Tema Escuro',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Mudar para Inglês',
    downloadPng: 'Baixar Imagem do Canvas (PNG)',
    downloadJson: 'Baixar Backup do Projeto (JSON)',
    shareProject: 'Compartilhar este projeto',
    copied: 'Copiado!',
    share: 'Compartilhar',
    shareEditable: 'Compartilhar Editável',
    shareEditableDesc: 'Quem recebe pode alterar o projeto',
    shareViewOnly: 'Compartilhar Somente Visualização',
    shareViewOnlyDesc: 'Abre em modo de leitura (ainda dá pra marcar itens como concluídos)',
    clearCanvas: 'Limpar todos os nós do Canvas',
    yesClear: 'Sim, limpar',
    confirmNewProjectTitle: 'Criar nova Crafting Tree?',
    confirmNewProjectDesc: 'Esta ação substitui o projeto que está aberto.',
    confirmNewProjectBodyPrefix: 'O projeto',
    confirmNewProjectBodyHas: 'tem',
    componentSingular: 'componente',
    componentPlural: 'componentes',
    confirmNewProjectBodyOverwritten: 'e será completamente sobrescrito.',
    confirmNewProjectBodyLostIntro: 'Tudo que estiver nele',
    confirmNewProjectBodyLostList: '(componentes, conexões, custos e marcações de concluído, tudo mesmo) será perdido e não há como ser desfeito.',
    confirmNewProjectBodyBackupHint: 'Se quiser guardar este projeto antes, cancele e use o botão',
    jsonWord: 'JSON',
    cancel: 'Cancelar',
    yesCreateNew: 'Sim, criar nova',
    performanceWarningTitle: 'Aviso de Performance',
    performanceWarningDesc: 'Alto volume de componentes detectado na Crafting Tree.',
    performanceWarningBodyPrefix: 'Sua árvore possui',
    componentsWord: 'componentes',
    performanceWarningBodySuffix: 'Expandir todas as ramificações simultaneamente pode causar consumo temporariamente alto de memória ou leves engasgos visuais durante a renderização simultânea dos ícones e conexões.',
    performanceWarningQuestion: 'Deseja prosseguir com a expansão total da árvore?',
    yesExpandAll: 'Sim, expandir tudo',
    goHomeTitle: 'Voltar para o início?',
    goHomeIconTitle: 'Ir para o início',
    goHomeDesc: 'Você será redirecionado para a página inicial do Vulcanode.',
    goHomeBodyPrefix: 'Seu projeto',
    goHomeBodySuffix: 'continua salvo automaticamente neste navegador e estará aqui quando você voltar.',
    yesGoHome: 'Sim, voltar ao início',
  },
  en: {
    renameProject: 'Click to rename the project',
    newCraftingTree: 'Create new Crafting Tree',
    collapseAllTitle: 'Collapse all component branches in the tree',
    collapseAll: 'Collapse All',
    expandAllTitle: 'Expand all component branches',
    expandAll: 'Expand All',
    treeProgress: 'Tree progress',
    remainingColumn: 'Remaining',
    summaryColumn: 'Summary',
    noComponentsYet: 'No components yet',
    allDone: 'All done!',
    left: 'Left',
    total: 'Total',
    switchToLightTheme: 'Switch to Light Theme',
    switchToDarkTheme: 'Switch to Dark Theme',
    switchToPortuguese: 'Switch to Portuguese',
    switchToEnglish: 'Switch to English',
    downloadPng: 'Download Canvas Image (PNG)',
    downloadJson: 'Download Project Backup (JSON)',
    shareProject: 'Share this project',
    copied: 'Copied!',
    share: 'Share',
    shareEditable: 'Share Editable',
    shareEditableDesc: 'The recipient can edit the project',
    shareViewOnly: 'Share View Only',
    shareViewOnlyDesc: 'Opens in read-only mode (items can still be marked as completed)',
    clearCanvas: 'Clear all nodes from the Canvas',
    yesClear: 'Yes, clear',
    confirmNewProjectTitle: 'Create new Crafting Tree?',
    confirmNewProjectDesc: 'This action replaces the currently open project.',
    confirmNewProjectBodyPrefix: 'The project',
    confirmNewProjectBodyHas: 'has',
    componentSingular: 'component',
    componentPlural: 'components',
    confirmNewProjectBodyOverwritten: 'and will be completely overwritten.',
    confirmNewProjectBodyLostIntro: 'Everything in it',
    confirmNewProjectBodyLostList: '(components, connections, costs and completion marks, really everything) will be lost and cannot be undone.',
    confirmNewProjectBodyBackupHint: 'If you want to save this project first, cancel and use the',
    jsonWord: 'JSON',
    cancel: 'Cancel',
    yesCreateNew: 'Yes, create new',
    performanceWarningTitle: 'Performance Warning',
    performanceWarningDesc: 'High volume of components detected in the Crafting Tree.',
    performanceWarningBodyPrefix: 'Your tree has',
    componentsWord: 'components',
    performanceWarningBodySuffix: 'Expanding all branches simultaneously may cause temporarily high memory usage or slight visual stutter while rendering all icons and connections at once.',
    performanceWarningQuestion: 'Do you want to proceed with fully expanding the tree?',
    yesExpandAll: 'Yes, expand all',
    goHomeTitle: 'Go back to the homepage?',
    goHomeIconTitle: 'Go to homepage',
    goHomeDesc: "You'll be redirected to the Vulcanode homepage.",
    goHomeBodyPrefix: 'Your project',
    goHomeBodySuffix: 'is automatically saved in this browser and will be here when you come back.',
    yesGoHome: 'Yes, go back',
  },
};
