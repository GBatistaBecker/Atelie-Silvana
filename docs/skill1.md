# Skill 1: Roadmap de Execução e Habilidades Técnicas

Este documento define o passo a passo de desenvolvimento e as habilidades técnicas cruciais que devem ser aplicadas para construir o e-commerce "Ateliê Silvana Becker". A IA deve seguir esta ordem de execução para garantir uma arquitetura sólida.

---

## Fase 1: Domínio do Banco de Dados (Supabase & SQL)
**Habilidade Foco:** Modelagem Relacional e Segurança (RLS).

1. **Criação das Tabelas:** Executar o script SQL no Supabase baseado no `spec.md` (Tabelas: `profiles`, `addresses`, `products`, `orders`, `order_items`).
2. **Triggers de Autenticação:** Criar uma Trigger no PostgreSQL do Supabase para que, toda vez que um usuário se cadastrar na tabela nativa `auth.users`, um registro seja criado automaticamente na tabela `profiles` com a role `client`.
3. **Row Level Security (RLS):** - Proteger as tabelas. Clientes só podem fazer `SELECT`, `UPDATE` ou `DELETE` nos seus próprios endereços (`addresses`) e pedidos (`orders`).
   - Apenas usuários com a role `admin` no `profiles` podem fazer `INSERT`, `UPDATE` ou `DELETE` na tabela de `products`.

---

## Fase 2: Domínio de Autenticação e Rotas (Next.js + Supabase SSR)
**Habilidade Foco:** Gerenciamento de Sessão no Servidor e Middlewares.

1. **Configuração do `@supabase/ssr`:** Criar os arquivos utilitários para instanciar o cliente do Supabase no servidor e no navegador.
2. **Middleware de Proteção (`middleware.ts`):** - Criar um middleware no Next.js para ler a sessão do usuário via cookies.
   - **Regra:** Se um usuário não autenticado tentar acessar `/profile` ou `/cart`, redirecionar para `/login`.
   - **Regra:** Se um usuário sem a role `admin` tentar acessar qualquer rota `/admin/...`, redirecionar para `/` (Home).
3. **Páginas de Auth:** Criar os Server Actions de `signUp`, `signIn` e `signOut`.

---

## Fase 3: Domínio de Catálogo e UI (Next.js RSC + Tailwind)
**Habilidade Foco:** React Server Components e Estilização Mobile-First.

1. **Data Fetching no Servidor:** Criar a página inicial (`/`) como um Server Component assíncrono. Fazer um `SELECT` na tabela `products` direto do servidor e renderizar a grade de produtos.
2. **Página Dinâmica de Produto (`/products/[id]`):** - Buscar o produto específico pelo ID.
   - Criar um Client Component (com `'use client'`) apenas para o formulário de "Adicionar ao Carrinho", onde o usuário preencherá a `custom_description` (ex: "Bordar o nome Maria").
3. **Supabase Storage (Imagens):** Garantir que o componente `<Image />` do Next.js esteja configurado no `next.config.js` para aceitar o domínio de imagens do Supabase.

---

## Fase 4: Domínio de Mutações e Carrinho (Server Actions)
**Habilidade Foco:** Lidar com formulários e transações no banco de dados.

1. **Estado do Carrinho:** Como o Next.js 14 usa Server Components, o carrinho não finalizado deve ser armazenado localmente (`localStorage`, Context API ou Zustand) ou em uma tabela temporária/cookies, até que o usuário clique em "Finalizar Pedido".
2. **Server Action de Checkout (`checkoutAction`):**
   - Receber os dados do carrinho (ID dos produtos, quantidades, `custom_description`) e o `address_id` escolhido.
   - Iniciar uma transação no Supabase:
     1. Criar o registro na tabela `orders` com o valor total.
     2. Fazer um loop no carrinho e inserir os registros na tabela `order_items` com os detalhes do bordado e o ID do pedido criado.
3. **Tratamento de Erros:** Exibir "Toast Notifications" (notificações na tela) amigáveis se a compra falhar ou se o usuário esquecer de selecionar o endereço.

---

## Fase 5: Domínio Administrativo (Dashboard)
**Habilidade Foco:** CRUD Seguro e Relatórios.

1. **Formulário de Novo Produto:** Criar uma tela em `/admin/products/new` que primeiro faça o upload da imagem para o Supabase Storage, pegue a URL pública, e então salve os dados (Nome, Preço, Descrição, URL da Imagem) na tabela `products`.
2. **Relatório de Vendas:** Criar a tabela de administração que cruza os dados (`JOIN`) de `orders`, `profiles` (para ver quem comprou) e `addresses` (para saber onde entregar).