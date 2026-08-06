import { LanguageDict } from '../useT';

export interface SidebarDict {
  componentsAndForgeHeading: string;
  dragComponentsIntro: string;
  circleDefaultName: string;
  circleTitle: string;
  circleDesc: string;
  compositionDefaultName: string;
  compositionTitle: string;
  compositionDescPrefix: string;
  compositionDescCostLabel: string;
  compositionDescSuffix: string;
  goalDefaultName: string;
  goalTitle: string;
  goalDesc: string;
  processDefaultName: string;
  processTitle: string;
  processDesc: string;
  componentTagsHeading: string;
  cancelTitle: string;
  createNewTagTitle: string;
  tagsIntro: string;
  tagNamePlaceholder: string;
  createButton: string;
  deleteTagTitle: string;
  footerHint: string;
}

export const sidebarDict: LanguageDict<SidebarDict> = {
  pt: {
    componentsAndForgeHeading: 'Componentes & Forja',
    dragComponentsIntro: 'Arraste componentes e monte sua Crafting Tree conectando da base em direção à meta no topo:',
    circleDefaultName: 'Novo Componente',
    circleTitle: 'Componente',
    circleDesc: 'Visual límpido com ícone central. Ideal para matérias-primas, móveis, despesas e itens singulares.',
    compositionDefaultName: 'Composição / Grupo',
    compositionTitle: 'Caixa de Composição',
    compositionDescPrefix: 'Conecte componentes nesta caixa para exibir o somatório (',
    compositionDescCostLabel: 'Custo Total: $X',
    compositionDescSuffix: ') no nó automaticamente!',
    goalDefaultName: 'Meta ou Receita Final',
    goalTitle: 'Meta ou Resultado',
    goalDesc: 'Contêiner para posicionar no topo absoluto da sua árvore de crafting ou meta de projeto.',
    processDefaultName: 'Processo / Estação',
    processTitle: 'Estação de Processo',
    processDesc: 'Demonstra uma passagem obrigatória de tempo ou estação de transformação da receita.',
    componentTagsHeading: 'Tags de Componentes',
    cancelTitle: 'Cancelar',
    createNewTagTitle: 'Criar Nova Tag',
    tagsIntro: 'Criadas dentro do projeto. Atribua aos componentes editando o card no hover:',
    tagNamePlaceholder: 'Nome da Tag...',
    createButton: 'Criar',
    deleteTagTitle: 'Excluir Tag do Projeto',
    footerHint: 'Dica: Passe o mouse no componente para expandir detalhes, ver URLs ou clicar no botão lápis de edição!',
  },
  en: {
    componentsAndForgeHeading: 'Components & Forge',
    dragComponentsIntro: 'Drag components and build your Crafting Tree by connecting from the base up to the goal at the top:',
    circleDefaultName: 'New Component',
    circleTitle: 'Component',
    circleDesc: 'Clean visual with a centered icon. Ideal for raw materials, furniture, expenses, and standalone items.',
    compositionDefaultName: 'Composition / Group',
    compositionTitle: 'Composition Box',
    compositionDescPrefix: 'Connect components to this box to display the automatic sum (',
    compositionDescCostLabel: 'Total Cost: $X',
    compositionDescSuffix: ') on the node!',
    goalDefaultName: 'Goal or Final Recipe',
    goalTitle: 'Goal or Result',
    goalDesc: 'Container for placing at the very top of your crafting tree or project goal.',
    processDefaultName: 'Process / Station',
    processTitle: 'Processing Station',
    processDesc: 'Demonstrates a required time step or transformation stage in the recipe.',
    componentTagsHeading: 'Component Tags',
    cancelTitle: 'Cancel',
    createNewTagTitle: 'Create New Tag',
    tagsIntro: 'Created within the project. Assign them to components by editing the card on hover:',
    tagNamePlaceholder: 'Tag name...',
    createButton: 'Create',
    deleteTagTitle: 'Delete Tag from Project',
    footerHint: 'Tip: Hover over a component to expand details, view URLs, or click the edit pencil button!',
  },
};
