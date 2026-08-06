import { LanguageDict } from '../useT';

export interface TemplateSelectorDict {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  blankTitle: string;
  blankDescription: string;
  blankFooter: string;
  rpgTitle: string;
  rpgDescription: string;
  rpgFooter: string;
  budgetTitle: string;
  budgetDescriptionPrefix: string;
  budgetDescriptionComponents: string;
  budgetDescriptionMiddle: string;
  budgetDescriptionCost: string;
  budgetDescriptionSuffix: string;
  budgetFooter: string;
  cakeTitle: string;
  cakeDescription: string;
  cakeFooter: string;
  importPrompt: string;
  importButton: string;
  invalidFile: string;
}

export const templateSelectorDict: LanguageDict<TemplateSelectorDict> = {
  pt: {
    badge: 'Vibe Vulcanode Única & Clean',
    titlePrefix: 'Escolha um Modelo para Iniciar sua',
    titleHighlight: 'Crafting Tree',
    description: 'Experimente nossos templates focados em árvores hierárquicas limpas (com ícones centrais, cards de hover detalhados e conexões em ângulo) ou comece do zero.',
    blankTitle: 'Projeto em Branco',
    blankDescription: 'Um canvas livre de diagramação hierárquica modular com todas as formas puras (Círculos, Caixas, Losangos e Hexágonos de Processo) à sua disposição.',
    blankFooter: 'Iniciar em Branco',
    rpgTitle: 'Crafting RPG: Espada Mística',
    rpgDescription: 'Árvore de receita com componentes em ícones puros na base, passando por estação de fundição até o Losango Mítico no topo como resultado.',
    rpgFooter: 'Carregar RPG',
    budgetTitle: 'Composição: Casamento & Moradia',
    budgetDescriptionPrefix: 'Árvore de custos:',
    budgetDescriptionComponents: 'Componentes (Móveis & Aluguéis)',
    budgetDescriptionMiddle: 'somados em cascata (',
    budgetDescriptionCost: 'Custo Total: $X',
    budgetDescriptionSuffix: ') em direção ao objetivo principal no topo!',
    budgetFooter: 'Carregar Composição',
    cakeTitle: 'Receita: Bolo Simples',
    cakeDescription: 'Árvore de receita real: ingredientes na base passam por estações encadeadas de preparo (bater, misturar, incorporar, assar) até o Bolo pronto no topo.',
    cakeFooter: 'Carregar Receita',
    importPrompt: 'Já possui um arquivo salvo de outro computador?',
    importButton: 'Importar Arquivo (.JSON)',
    invalidFile: 'Arquivo JSON inválido ou corrompido.',
  },
  en: {
    badge: 'Unique & Clean Vulcanode Vibe',
    titlePrefix: 'Choose a Template to Start Your',
    titleHighlight: 'Crafting Tree',
    description: 'Try our templates focused on clean hierarchical trees (with center icons, detailed hover cards and angled connections) or start from scratch.',
    blankTitle: 'Blank Project',
    blankDescription: 'A free modular hierarchical diagramming canvas with all the pure shapes (Circles, Boxes, Diamonds and Process Hexagons) at your disposal.',
    blankFooter: 'Start Blank',
    rpgTitle: 'Crafting RPG: Mystic Sword',
    rpgDescription: 'Recipe tree with pure icon components at the base, going through a smelting station up to the Mythic Diamond at the top as the result.',
    rpgFooter: 'Load RPG',
    budgetTitle: 'Composition: Wedding & Home',
    budgetDescriptionPrefix: 'Cost tree:',
    budgetDescriptionComponents: 'Components (Furniture & Rent)',
    budgetDescriptionMiddle: 'summed in cascade (',
    budgetDescriptionCost: 'Total Cost: $X',
    budgetDescriptionSuffix: ') toward the main goal at the top!',
    budgetFooter: 'Load Composition',
    cakeTitle: 'Recipe: Simple Cake',
    cakeDescription: 'A real recipe tree: base ingredients flow through chained prep stations (beat, mix, fold, bake) up to the finished Cake at the top.',
    cakeFooter: 'Load Recipe',
    importPrompt: 'Already have a saved file from another computer?',
    importButton: 'Import File (.JSON)',
    invalidFile: 'Invalid or corrupted JSON file.',
  },
};
