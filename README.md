# Ateliê Silvana Becker - E-commerce

Um e-commerce completo e moderno dedicado à venda de bordados artesanais e personalizados. O sistema permite que os clientes naveguem pelo catálogo e adicionem notas detalhadas de personalização para cada bordado. O processamento de pagamentos é terceirizado via InfinitePay e as notificações transacionais são gerenciadas pelo Resend.

---

## Tecnologias Utilizadas

* **Framework:** Next.js 14 (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS (Abordagem Mobile-First)
* **Banco de Dados & Autenticação:** Supabase (`@supabase/ssr`)
* **E-mails Transacionais:** Resend (`resend` + `@react-email/components`)
* **Gateway de Pagamento:** InfinitePay (Checkout integrado via API/Webhooks)
* **Ícones:** Lucide React

---

## Arquitetura e Estrutura do Projeto

O projeto segue os padrões recomendados do Next.js 14, utilizando **React Server Components (RSC)** por padrão e isolando a lógica de modificação de dados em **Server Actions**.

```text
├── src/
│   ├── actions/        # Mutações de dados (Server Actions)
│   ├── app/            # Rotas, páginas, layouts e endpoints de API/Webhooks
│   ├── components/     # Componentes reutilizáveis de interface (UI)
│   ├── lib/            # Clientes de serviços (Supabase, Resend, etc.)
│   └── utils/          # Funções utilitárias e auxiliares
├── rules.md            # Diretrizes estritas de desenvolvimento
└── spec.md             # Especificação técnica do escopo e banco de dados

 Configuração do Ambiente
Para rodar o projeto localmente, crie um arquivo chamado .env.local na raiz do diretório e preencha com as suas chaves de ambiente:

Snippet de código
# Banco de Dados & Autenticação (Supabase)
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-privada

# Disparo de E-mails (Resend)
RESEND_API_KEY=sua-chave-do-resend

# Gateway de Pagamentos (InfinitePay)
INFINITEPAY_API_KEY=sua-chave-da-infinitepay
⚠️ Nota: Nunca envie o arquivo .env.local para o repositório do GitHub. Ele contém chaves privadas e confidenciais do servidor.

🛠️ Como Executar o Projeto
Instale as dependências:

Bash
npm install
# ou
yarn install
# ou
pnpm install
Execute o servidor de desenvolvimento:

Bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
Acesse no navegador:
Abra http://localhost:3000 para visualizar a aplicação rodando localmente.

 Regras e Modelagem de Dados
A estrutura completa das tabelas do banco de dados (como profiles, products, orders, order_items e addresses), bem como os fluxos de segurança para controle de rotas (client vs admin) e proteção de webhooks, estão documentadas de forma detalhada nos arquivos de contexto locais:

Especificação Completa (spec.md)

Regras de Desenvolvimento (rules.md)

## Deploy (Vercel)
Este projeto foi desenhado especificamente para rodar em arquitetura Serverless dentro da plataforma Vercel. Toda a persistência de arquivos estáticos (como fotos de produtos enviadas pelo administrador) é enviada e servida via Supabase Storage, garantindo compatibilidade com o sistema de arquivos efêmero da Vercel.