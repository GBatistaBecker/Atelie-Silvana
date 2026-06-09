# Task 1: Setup Inicial e Estruturação de Pastas

Esta tarefa foca em inicializar o projeto Next.js 14, limpar os arquivos desnecessários que vêm por padrão e criar a arquitetura de pastas baseada no nosso `rules.md`.

## Passo 1: Inicialização do Projeto
1. Rodar o comando de criação do Next.js (se ainda não foi criado):
   `npx create-next-app@latest .`
2. Escolher as seguintes opções durante a instalação:
   - TypeScript: **Yes**
   - ESLint: **Yes**
   - Tailwind CSS: **Yes**
   - `src/` directory: **Yes**
   - App Router: **Yes**
   - Customize default import alias: **No**

## Passo 2: Estrutura de Pastas e Imagens
O projeto deve seguir a seguinte organização de diretórios. A IA deve criar as pastas que estiverem faltando:

/
├── public/
│   └── img/               <-- Adicione aqui APENAS logos e assets estáticos do site. Fotos de produtos irão para o Supabase Storage futuramente.
├── src/
│   ├── app/               <-- Rotas do Next.js (App Router)
│   │   ├── (auth)/        <-- Grupo de rotas de autenticação (login, register)
│   │   ├── admin/         <-- Rotas restritas do administrador
│   │   ├── profile/       <-- Rotas restritas do cliente
│   │   └── products/      <-- Rotas dinâmicas do catálogo
│   ├── components/        <-- Componentes visuais isolados (UI)
│   │   ├── ui/            <-- Componentes base (botões, inputs - ex: Shadcn)
│   │   └── shared/        <-- Componentes compostos (Navbar, Footer, ProductCard)
│   ├── lib/               <-- Funções e configurações essenciais
│   │   └── supabase/      <-- Configuração dos clientes Supabase (Browser e Server)
│   ├── actions/           <-- Server Actions (ex: addItemToCart, createProduct)
│   ├── types/             <-- Tipagens globais do TypeScript (ex: interfaces do banco de dados)
│   └── utils/             <-- Funções auxiliares (ex: formatador de moeda, formatador de data)
├── rules.md
├── spec.md
├── skill1.md
└── skill2.md

## Passo 3: Limpeza Inicial
1. Limpar o arquivo `src/app/page.tsx`, removendo o código padrão do Next.js e deixando apenas um componente funcional simples retornando `<h1>Home do Ateliê</h1>`.
2. Limpar o arquivo `src/app/globals.css`, mantendo apenas as diretivas do Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`).