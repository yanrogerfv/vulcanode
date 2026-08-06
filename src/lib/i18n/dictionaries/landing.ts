import { LanguageDict } from '../useT';

export interface LandingDict {
  switchToLightTheme: string;
  switchToDarkTheme: string;
  switchToPortuguese: string;
  switchToEnglish: string;
  createProjectNow: string;
  heroBadge: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  startModularForge: string;
  templatesIntro: string;
  budgetTemplateTitle: string;
  budgetTemplateDescPrefix: string;
  budgetTemplateDescSuffix: string;
  totalCostXLabel: string;
  rpgTemplateTitle: string;
  rpgTemplateDesc: string;
  cakeTemplateTitle: string;
  cakeTemplateDesc: string;
  previewLabel: string;
  previewCleanIconMode: string;
  previewTotalCostTop: string;
  previewWeddingNode: string;
  previewHomeCompositionCost: string;
  previewHomeCompositionNode: string;
  previewFridge: string;
  previewCooktop: string;
  featureCleanModeTitle: string;
  featureCleanModeDesc: string;
  featureHierarchyTitle: string;
  featureHierarchyDescPrefix: string;
  featureHierarchyDescSuffix: string;
  featureCollapseTitle: string;
  featureCollapseDesc: string;
  featureCascadeTitle: string;
  featureCascadeDesc: string;
  featureShareTitle: string;
  featureShareDesc: string;
  featureExportTitle: string;
  featureExportDesc: string;
  footerRights: string;
  footerTerms: string;
  footerPrivacy: string;
  footerContact: string;
}

export const landingDict: LanguageDict<LandingDict> = {
  pt: {
    switchToLightTheme: 'Alternar para Tema Claro',
    switchToDarkTheme: 'Alternar para Tema Escuro',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Mudar para Inglês',
    createProjectNow: 'Criar Projeto Agora',
    heroBadge: 'Árvores Hierárquicas & Componentes Límpidos no Canvas',
    heroHeadlinePrefix: 'Crafting Trees e grafos modulares de composição com uma',
    heroHeadlineHighlight: 'vibe única.',
    heroSubheadline: 'Projete da base para o topo. Conecte componentes à estações e receitas finais usando traçado ortogonal suave e cards detalhados no cursor.',
    startModularForge: 'Iniciar Forja Modular',
    templatesIntro: 'Ou comece com nossos Templates Prontos de Crafting Trees:',
    budgetTemplateTitle: 'Composição: Casamento & Moradia',
    budgetTemplateDescPrefix: 'Componentes conectados somando',
    budgetTemplateDescSuffix: 'em cascata para a meta!',
    totalCostXLabel: 'Custo Total: $X',
    rpgTemplateTitle: 'Crafting RPG: Espada Mística',
    rpgTemplateDesc: 'Com componentes em ícone na base, estação de fogo e Losango Mítico no topo.',
    cakeTemplateTitle: 'Receita: Bolo Simples',
    cakeTemplateDesc: 'Ingredientes reais passando por estações encadeadas de preparo até o Bolo pronto no topo.',
    previewLabel: 'Preview da Hierarquia de Crafting Tree',
    previewCleanIconMode: 'Modo Límpido de Ícones',
    previewTotalCostTop: 'Custo Total no Topo: $ 5.000,00',
    previewWeddingNode: 'Casamento',
    previewHomeCompositionCost: 'Custo Total: $ 5.000,00',
    previewHomeCompositionNode: 'Composição Lar',
    previewFridge: 'Geladeira',
    previewCooktop: 'Cooktop',
    featureCleanModeTitle: 'Modo Límpido & Ícones Puros',
    featureCleanModeDesc: 'No board, os componentes exibem apenas seu formato e ícone (com o nome abaixo). Passe o mouse para abrir um card de detalhes completo estilo Wiki com URLs e custos!',
    featureHierarchyTitle: 'Hierarquia & Conexões em Ângulo',
    featureHierarchyDescPrefix: 'Conecte componentes na base em direção ao pai no topo. As linhas seguem traçado ortogonal suave em cantos arredondados, somando custos (',
    featureHierarchyDescSuffix: ') no nó pai.',
    featureCollapseTitle: 'Colapsar e Expandir Ramificações',
    featureCollapseDesc: 'Para árvores densas com muita recursividade, clique nos botões `-`/`+` de cada nó ou use os botões globais no Header para colapsar ramificações e manter a performance imbatível.',
    featureCascadeTitle: 'Progresso em Cascata',
    featureCascadeDesc: 'Marque componentes como concluídos e veja o progresso subir automaticamente pela árvore. Desmarcar um filho desfaz a conclusão de todos os pais que dependiam dele.',
    featureShareTitle: 'Compartilhamento & Modo Visualização',
    featureShareDesc: 'Gere um link compacto do seu projeto para compartilhar em modo Edição ou apenas Visualização, sem precisar de conta ou servidor.',
    featureExportTitle: 'Exportação em PNG',
    featureExportDesc: 'Exporte a árvore inteira como imagem em alta resolução com um clique, pronta para colar em uma wiki, guia ou planilha de orçamento.',
    footerRights: 'Todos os direitos reservados.',
    footerTerms: 'Termos de Uso',
    footerPrivacy: 'Política de Privacidade',
    footerContact: 'Contato',
  },
  en: {
    switchToLightTheme: 'Switch to Light Theme',
    switchToDarkTheme: 'Switch to Dark Theme',
    switchToPortuguese: 'Switch to Portuguese',
    switchToEnglish: 'Switch to English',
    createProjectNow: 'Start a Project Now',
    heroBadge: 'Hierarchical Trees & Clean Icon Components on Canvas',
    heroHeadlinePrefix: 'Crafting trees and modular composition graphs with a',
    heroHeadlineHighlight: 'vibe all their own.',
    heroSubheadline: 'Design from the ground up. Connect components to stations and final recipes with smooth orthogonal routing and rich detail cards on hover.',
    startModularForge: 'Fire Up the Modular Forge',
    templatesIntro: 'Or jump-start it with one of our ready-made Crafting Tree templates:',
    budgetTemplateTitle: 'Composition: Wedding & New Home',
    budgetTemplateDescPrefix: 'Connected components cascading toward a',
    budgetTemplateDescSuffix: 'goal!',
    totalCostXLabel: 'Total Cost: $X',
    rpgTemplateTitle: 'RPG Crafting: Mystic Sword',
    rpgTemplateDesc: 'Icon components at the base, a forge station, and a Mythic Diamond up top.',
    cakeTemplateTitle: 'Recipe: Simple Cake',
    cakeTemplateDesc: 'Real ingredients flowing through chained prep stations up to the finished Cake at the top.',
    previewLabel: 'Crafting Tree Hierarchy Preview',
    previewCleanIconMode: 'Clean Icon Mode',
    previewTotalCostTop: 'Total Cost at the Top: $5,000.00',
    previewWeddingNode: 'Wedding',
    previewHomeCompositionCost: 'Total Cost: $5,000.00',
    previewHomeCompositionNode: 'Home Composition',
    previewFridge: 'Fridge',
    previewCooktop: 'Cooktop',
    featureCleanModeTitle: 'Clean Mode & Pure Icons',
    featureCleanModeDesc: 'On the board, components show only their shape and icon (with the name below). Hover to open a full Wiki-style detail card with URLs and costs.',
    featureHierarchyTitle: 'Hierarchy & Angled Connections',
    featureHierarchyDescPrefix: 'Connect components at the base up toward their parent. Lines follow smooth orthogonal routing with rounded corners, rolling costs (',
    featureHierarchyDescSuffix: ') up into the parent node.',
    featureCollapseTitle: 'Collapse & Expand Branches',
    featureCollapseDesc: 'For dense, deeply recursive trees, click the `-`/`+` buttons on any node, or use the global Header buttons to collapse branches and keep performance unbeatable.',
    featureCascadeTitle: 'Cascading Progress',
    featureCascadeDesc: 'Mark components as done and watch progress climb automatically through the tree. Unchecking a child undoes completion for every parent that depended on it.',
    featureShareTitle: 'Sharing & View-Only Mode',
    featureShareDesc: 'Generate a compact link to your project and share it in Edit or View-Only mode, no account or server required.',
    featureExportTitle: 'PNG Export',
    featureExportDesc: 'Export the entire tree as a high-resolution image in one click, ready to paste into a wiki, guide, or budget spreadsheet.',
    footerRights: 'All rights reserved.',
    footerTerms: 'Terms of Use',
    footerPrivacy: 'Privacy Policy',
    footerContact: 'Contact',
  },
};
