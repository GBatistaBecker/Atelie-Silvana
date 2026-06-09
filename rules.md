# Regras do Projeto (Next.js 14 - App Router & Supabase)

Você é um desenvolvedor Sênior especialista em Next.js 14, Supabase, TypeScript e Tailwind CSS.
Sempre siga as diretrizes abaixo ao gerar, refatorar ou analisar o código deste repositório:

## Stack Principal
- Next.js 14 (App Router)
- Supabase (Autenticação, Banco de Dados e Storage)
- TypeScript (Strict Mode)
- Tailwind CSS
- **Resend** (E-mails transacionais via `resend` e `@react-email/components`)
- **InfinitePay** (Gateway de pagamento / Checkout terceirizado)

## Arquitetura do Next.js 14 (App Router)
- **Server Components por Padrão:** Todos os componentes devem ser React Server Components (RSC) por definição. Use a diretiva `'use client'` estritamente na primeira linha de arquivos que necessitem de estado (`useState`, `useEffect`), hooks de cliente (como `useSearchParams` ou `useRouter` vindos de `next/navigation`) ou eventos de interação do usuário.
- **Estrutura de Pastas:**
  - As rotas, páginas e layouts ficam dentro de `src/app`.
  - Componentes globais e reutilizáveis de interface ficam em `src/components`.
  - Lógicas de negócio, clientes do Supabase e funções utilitárias ficam em `src/lib` ou `src/utils`.
- **Busca de Dados (Data Fetching):** Faça a busca de dados diretamente dentro de Server Components usando funções assíncronas nativas (`async/await`) consultando o Supabase. Evite criar rotas de API (`src/app/api/...`) internas apenas para servir dados para as suas próprias páginas.
- **Mutações com Server Actions:** Para envio de formulários e mutações de dados (POST, PUT, DELETE), utilize Server Actions (`'use server'`) integradas ao ecossistema do Next.js e ao cliente do Supabase para servidor.

## Integração com Supabase
- **Criação de Clientes baseada em Ambiente:** Utilize o pacote `@supabase/ssr` para gerenciar a criação de instâncias do cliente Supabase de acordo com o contexto de execução:
  - Em **Server Components, Server Actions e Route Handlers**, utilize o cliente de servidor configurado com os cookies do Next.js (`createServerClient`).
  - Em **Client Components** (`'use client'`), utilize o cliente de navegador (`createBrowserClient`).
- **Segurança e Chaves (Env Vars):**
  - Nunca exponha a chave `SUPABASE_SERVICE_ROLE_KEY` no lado do cliente. Ela deve ser mantida estritamente no servidor (sem o prefixo `NEXT_PUBLIC_`).
  - Para operações comuns e autenticação no cliente, utilize apenas a `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Tratamento de Erros:** Sempre capture e trate adequadamente o objeto `{ data, error }` retornado pelas queries do Supabase, aplicando logs informativos e amigáveis para o usuário em caso de falha.

## Integrações Externas (InfinitePay & Resend)
- **Segurança de Chaves de API:** Nunca exponha chaves secretas externas (como `RESEND_API_KEY` ou credenciais privadas da InfinitePay) no lado do cliente (`'use client'`). Toda a comunicação com APIs externas deve ocorrer estritamente em ambiente de servidor (Server Actions ou Route Handlers).
- **Checkout e Webhooks (InfinitePay):**
  - O empacotamento dos dados do carrinho e a requisição para gerar links de pagamento na InfinitePay devem ser processados via Server Actions.
  - Para processar as notificações assíncronas de pagamento, implemente um Route Handler em `src/app/api/webhooks/infinitepay/route.ts`. É obrigatório validar a assinatura/token do webhook recebido antes de atualizar o status do pedido para `'paid'` na tabela `orders`.
- **Notificações por E-mail (Resend):**
  - Utilize o pacote oficial da `resend` integrado com `@react-email/components` para construir as estruturas e layouts visuais dos e-mails transacionais usando componentes React.
  - O disparo de e-mails nunca deve bloquear o tempo de resposta ou travar a navegação do usuário. Execute as funções de envio de forma assíncrona, posicionando-as preferencialmente dentro do Route Handler do Webhook da InfinitePay (para confirmação de pagamento) ou logo após o término da Server Action de checkout (para confirmação de pedido gerado).

## Padrões de Código e TypeScript
- Use "Early Returns" para evitar o aninhamento excessivo de blocos `if/else`.
- Tipagem estrita: É proibido o uso de `any`. Se o tipo for dinâmico ou desconhecido, utilize `unknown` e faça a validação de tipos (Type Guarding). Se os tipos do banco de dados estiverem gerados via CLI do Supabase (`Database`), utilize-os ativamente para tipar as respostas das queries.
- **Convenção de Exportação:** Use exportações nomeadas (`export const MyComponent = ...`) para componentes de UI em geral. Apenas use `export default` nos arquivos obrigatórios do Next.js (como `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).

## Estilização e UI
- **Classes de Utilidade:** O projeto usa exclusivamente Tailwind CSS. Nunca crie arquivos `.css` separados ou use estilos inline (`style={{...}}`).
- **Cores e Temas:** Não utilize cores arbitrárias em formato hexadecimal (ex: `text-[#ff3366]`). Consulte e utilize sempre as classes e variáveis de cor configuradas no `tailwind.config.ts` (ex: `bg-primary`, `text-muted-foreground`, `border-border`).
- **Responsividade:** Siga rigorosamente o princípio Mobile-First (estilize para telas menores primeiro e adicione os prefixos `md:`, `lg:`, etc., conforme a necessidade).
- **Ícones:** Utilize exclusivamente a biblioteca `lucide-react`.

## Tipografia e Fontes
- **Otimização:** Nunca importe fontes usando a tag `<link>` no HTML ou `@import` no CSS. Todas as fontes devem ser gerenciadas pelo pacote nativo `next/font/google` ou `next/font/local` e aplicadas diretamente no arquivo `layout.tsx`.
- **Uso no Tailwind:** Aplique famílias de fontes utilizando as classes utilitárias mapeadas no projeto:
  - Para títulos e cabeçalhos (h1, h2, h3, etc.), use sempre a classe `font-heading`.
  - Para textos comuns, parágrafos e botões, use a classe `font-sans`.

## Otimização e Performance Geral
- **Imagens:** Use sempre o componente `<Image />` de `next/image` para otimização automática de tamanho, formato e lazy loading. Nunca use a tag HTML `<img>` nativa. Caso as imagens venham do Supabase Storage, certifique-se de configurar o domínio do Supabase no arquivo `next.config.js`.
- **Links:** Use o componente `<Link>` de `next/link` para navegação interna para garantir o prefetching automático de páginas e melhor performance de transição.

## Ambiente e Deploy (Vercel)
- O projeto tem como alvo de deploy a plataforma **Vercel** (ambiente Serverless).
- **Sistema de Arquivos Efêmero:** Nunca gere código que dependa de salvar, modificar ou ler arquivos gerados dinamicamente no disco local do servidor. Qualquer upload de arquivos deve ser direcionado para os Buckets do **Supabase Storage**.

## 🎨 Paleta de Cores Oficial (Identidade Visual)
Sempre utilize a paleta "Warm Neutral / Vintage" para estilizar os componentes, botões, fundos e textos.
* Principal/Fundo Claro (Vintage Beige): `#F3EAE5`
* Fundo Secundário/Cards (Soft Beige): `#ECE1D9`
* Bordas/Divisores (Earth Tone Light): `#DDD0C2`
* Destaques/Botões Secundários (Muted Warm): `#D2B6A2`
* Textos Escuros/Botões Principais (Deep Earth): `#B28F76`