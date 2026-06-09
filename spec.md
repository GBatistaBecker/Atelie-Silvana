# Especificação do Projeto (Project Spec) - Ateliê Silvana Becker

## 1. Visão Geral
O projeto é o **Ateliê Silvana Becker**, um e-commerce dedicado à venda de bordados artesanais e personalizados. 
O foco do sistema é permitir que os clientes naveguem pelo catálogo de produtos e, no momento da compra, possam adicionar descrições detalhadas e notas de personalização (como solicitar a inclusão de um nome específico ou frase no bordado). O sistema atenderá a dois tipos de usuários: os clientes (que realizam os pedidos) e o administrador (que gerencia o catálogo e recebe os detalhes das encomendas). O processamento de pagamentos será terceirizado via **InfinitePay**, e as atualizações cruciais de status do pedido serão notificadas de forma automatizada ao cliente por e-mail utilizando o **Resend**.

---

## 2. Funcionalidades Principais

### Painel do Cliente
- **Autenticação:** Cadastro de conta, Login e Logout (gerenciados via Supabase Auth).
- **Home e Catálogo:** Visualização da página inicial com os produtos disponíveis para compra.
- **Página de Detalhes do Produto:** Tela com informações do produto onde o cliente pode definir a quantidade e adicionar um texto/descrição com a personalização desejada (ex: nome a ser bordado).
- **Carrinho de Compras e Checkout:** Gerenciamento dos produtos adicionados e integração com o checkout da **InfinitePay**, enviando nome do produto, quantidade, valor e dados do cliente para processamento externo.
- **Gerenciamento de Endereços:** Tela dentro do perfil para o cliente cadastrar, visualizar, editar e remover endereços de entrega.
- **Histórico de Compras:** Lista de todos os pedidos já realizados pela conta do cliente.
- **Editar Perfil:** Tela para o cliente atualizar seus dados cadastrais (como nome).
- **Notificações Automáticas:** O cliente receberá e-mails transacionais automáticos informando sobre a criação do pedido e atualizações importantes de status (ex: pagamento aprovado, pedido enviado).

### Painel do Administrador (Restrito)
- **Autenticação:** Login seguro para a dona do ateliê (identificada pela role `admin` na tabela `profiles`).
- **Gerenciamento de Produtos (CRUD):** - Adicionar novos produtos informando Nome, Valor e fazendo o upload da Imagem (salva no Supabase Storage).
  - Editar informações de produtos já cadastrados.
- **Relatório e Histórico de Vendas:** Tela com o histórico completo de todas as vendas do site (com detalhes de entrega e personalização), contendo filtros (por data ou status) para acompanhar o faturamento total.

---

## 3. Mapa de Rotas (Next.js 14 App Router)

### Rotas Públicas
- `/` -> Home / Catálogo de produtos.
- `/products/[id]` -> Página de detalhes do produto e campo de personalização.
- `/login` -> Tela de login (Clientes e Admin).
- `/register` -> Tela de cadastro de novos clientes.

### Rotas Privadas (Apenas Clientes Autenticados)
- `/cart` -> Carrinho de compras e redirecionamento para o checkout.
- `/profile` -> Tela de edição de perfil do usuário.
- `/profile/addresses` -> Tela para gerenciar os endereços cadastrados.
- `/profile/orders` -> Histórico de compras do cliente.

### API Routes / Webhooks (Públicas com validação de segurança)
- `/api/webhooks/infinitepay` -> Endpoint oculto para receber notificações de pagamento assíncronas da InfinitePay.

### Rotas Privadas do Administrador (Apenas com role `admin`)
- `/admin` -> Dashboard do administrador com o Relatório de Vendas Totais e filtros.
- `/admin/products` -> Lista de produtos cadastrados com opções de editar ou remover.
- `/admin/products/new` -> Formulário para adicionar um novo produto.

---

## 4. Modelo de Dados (Banco de Dados - Supabase / Postgres)

### Tabela: `profiles`
*Extensão da tabela nativa de autenticação do Supabase (`auth.users`). Guarda dados adicionais do usuário.*
- `id` (UUID, Primary Key, references `auth.users.id` com DELETE CASCADE)
- `name` (TEXT, obrigatório)
- `email` (TEXT, único, obrigatório)
- `role` (TEXT, padrão: `'client'`. Valores possíveis: `'client'` ou `'admin'`)
- `created_at` (TIMESTAMP WITH TIME ZONE, padrão: `now()`)

### Tabela: `addresses`
*Guarda os endereços de entrega cadastrados pelos clientes.*
- `id` (UUID, Primary Key, padrão: `gen_random_uuid()`)
- `user_id` (UUID, Foreign Key -> `profiles.id` com DELETE CASCADE)
- `zip_code` (TEXT, obrigatório) -> *CEP*
- `street` (TEXT, obrigatório) -> *Rua / Avenida*
- `number` (TEXT, obrigatório) -> *Número da residência*
- `complement` (TEXT, opcional) -> *Apartamento, Bloco, etc.*
- `neighborhood` (TEXT, obrigatório) -> *Bairro*
- `city` (TEXT, obrigatório) -> *Cidade*
- `state` (TEXT, obrigatório) -> *Estado (ex: SP, RJ)*
- `created_at` (TIMESTAMP WITH TIME ZONE, padrão: `now()`)

### Tabela: `products`
*Guarda as informações dos produtos que aparecem no catálogo.*
- `id` (UUID, Primary Key, padrão: `gen_random_uuid()`)
- `name` (TEXT, obrigatório)
- `price` (NUMERIC(10,2), obrigatório)
- `image_url` (TEXT, obrigatório) -> *Link gerado pelo Supabase Storage*
- `description` (TEXT, opcional)
- `created_at` (TIMESTAMP WITH TIME ZONE, padrão: `now()`)

### Tabela: `orders`
*Registra o cabeçalho de cada venda realizada no sistema.*
- `id` (UUID, Primary Key, padrão: `gen_random_uuid()`)
- `user_id` (UUID, Foreign Key -> `profiles.id`)
- `address_id` (UUID, Foreign Key -> `addresses.id`) -> *Endereço selecionado para esta entrega*
- `total_price` (NUMERIC(10,2), obrigatório)
- `status` (TEXT, padrão: `'pending'`. ex: `'paid'`, `'shipped'`, `'cancelled'`)
- `infinitepay_transaction_id` (TEXT, opcional) -> *ID identificador da transação gerada na InfinitePay*
- `created_at` (TIMESTAMP WITH TIME ZONE, padrão: `now()`)

### Tabela: `order_items`
*Guarda os produtos que fazem parte de cada pedido, incluindo a personalização do bordado.*
- `id` (UUID, Primary Key, padrão: `gen_random_uuid()`)
- `order_id` (UUID, Foreign Key -> `orders.id` com DELETE CASCADE)
- `product_id` (UUID, Foreign Key -> `products.id`)
- `quantity` (INTEGER, obrigatório, padrão: 1)
- `price_at_purchase` (NUMERIC(10,2), obrigatório) -> *Preço cobrado no momento da compra*
- `custom_description` (TEXT, opcional) -> *Aqui entra o texto do bordado personalizado*

---

## 5. Integrações Externas
- **Gateway de Pagamento:** InfinitePay (Checkout terceirizado). O sistema deverá gerar o link de pagamento contendo os itens do carrinho e processar chamadas de Webhooks para atualizar o `status` do pedido na tabela `orders` automaticamente para `'paid'` quando o pagamento for aprovado.
- **E-mail Transacional:** Integração com o **Resend** para envio de notificações automáticas aos clientes. Os templates de e-mail devem incluir o resumo dos produtos comprados, preço, endereço e o status atualizado do pedido.