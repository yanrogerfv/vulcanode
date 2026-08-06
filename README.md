# Vulcanode

Vulcanode é uma plataforma web para criação visual de **árvores de crafting** e **grafos de
composição modular** — estruturas hierárquicas usadas tanto para receitas e itens de jogos (ex: a
cadeia de materiais para forjar uma arma mais forte) quanto para agrupamentos do mundo real (ex:
listar e somar móveis divididos por cômodos de uma casa, com custo total agregado
automaticamente).

Tudo roda no navegador: não há cadastro, login ou servidor guardando os seus projetos.

## Funcionalidades

- **Canvas ultrafluido** construído sobre [React Flow](https://reactflow.dev/), com nós em
  círculo, quadrado arredondado, losango (meta) e hexágono (estação/processo).
- **Hierarquia invertida**: componentes na base conectam-se para cima em direção ao pai/meta,
  somando custos automaticamente em cascata.
- **Progresso em cascata**: marque componentes como concluídos; desmarcar um filho desfaz
  automaticamente a conclusão de todos os pais que dependiam dele.
- **Colapsar/expandir ramificações** para manter árvores densas performáticas e organizadas.
- **Catálogo completo de ícones** (Lucide, carregados sob demanda) para identificar cada
  componente.
- **Compartilhamento sem servidor**: gere um link compacto do projeto (dados codificados na
  própria URL) em modo Edição ou apenas Visualização.
- **Exportação em PNG** da árvore inteira, em alta resolução, com um clique.
- **Tema claro/escuro** com paleta consistente em todo o board, sidebar e modais.
- **Templates prontos** para começar rápido: orçamento de casamento/moradia e crafting de RPG.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- [@xyflow/react (React Flow)](https://reactflow.dev/) v12 para o canvas de nós e conexões
- [Zustand](https://zustand.docs.pmnd.rs/) com `persist` para estado e armazenamento local
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (sobre
  `@base-ui/react`)
- [lz-string](https://github.com/pieroxy/lz-string) para compactar o payload dos links de
  compartilhamento
- [html-to-image](https://github.com/bubkoo/html-to-image) para exportação em PNG
- [lucide-react](https://lucide.dev/) para o catálogo de ícones

> **Nota:** este projeto usa uma versão do Next.js mais recente que pode divergir de convenções
> conhecidas. Consulte `node_modules/next/dist/docs/` antes de alterar comportamentos de
> roteamento, metadata ou build.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Outros scripts disponíveis:

```bash
npm run build   # build de produção
npm run start   # serve o build de produção
npm run lint    # eslint
```

## Deploy

O projeto é stateless do lado do servidor (todo o estado do usuário vive no navegador), o que o
torna compatível com deploy estático/serverless padrão na [Vercel](https://vercel.com/new). Antes
de publicar:

1. Atualize `metadataBase` em `src/app/layout.tsx` e o e-mail de contato em `src/app/termos` e
   `src/app/privacidade` para o domínio final.
2. Rode `npm run build` localmente para validar a build de produção.

## Estrutura do projeto

```
src/
  app/            # rotas (landing, /app do board, /termos, /privacidade)
  components/      # canvas, nós, edges, modais, UI compartilhada
  store/          # Zustand (estado do projeto, templates, codec de compartilhamento)
  lib/            # utilitários
```
