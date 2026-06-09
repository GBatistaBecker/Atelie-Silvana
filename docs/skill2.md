# Skill 2: Roadmap de Testes e Qualidade de Código (QA)

Este documento define as diretrizes e a ordem de execução para a implementação de testes automatizados no e-commerce "Ateliê Silvana Becker". A IA deve seguir estas abordagens para garantir que refatorações futuras não quebrem as funcionalidades principais.

---

## Stack de Testes Definida
- **Testes Unitários e de Componentes:** Vitest + React Testing Library (RTL). *(Escolhemos Vitest por ser mais rápido e nativo com configurações modernas comparado ao Jest).*
- **Testes End-to-End (E2E):** Playwright. *(Ideal para testar fluxos completos no Next.js).*
- **Testes de Banco de Dados/Integração:** Supabase Local Dev (CLI) para testar Server Actions contra um banco real de testes, em vez de fazer "mocks" complexos.

---

## Fase 1: Testes Unitários (Componentes de UI)
**Objetivo:** Garantir que os blocos visuais menores funcionem isoladamente.

1. **Componentes Base:** Testar os componentes reutilizáveis (ex: botões, inputs, modais). 
   - *Regra:* Garantir que eventos de `onClick` e `onChange` estão sendo disparados corretamente.
2. **Product Card:** Testar se o cartão de produto renderiza o Nome, Preço (formatado em R$) e a Imagem corretamente.
3. **Formulário de Personalização:** Renderizar o campo `custom_description` e validar se ele aceita texto e dispara mensagens de erro caso o usuário tente enviar vazio (se for obrigatório).

---

## Fase 2: Testes de Integração (Server Actions & Supabase)
**Objetivo:** Validar a comunicação entre o Next.js (Servidor) e o Banco de Dados.

1. **Mocking do Supabase:** Para testes rápidos de Server Actions, utilizar bibliotecas como `vitest-mock-extended` para simular as respostas do cliente `@supabase/ssr`.
2. **Ação de Adicionar ao Carrinho:** Testar se a Server Action calcula os valores corretamente e retorna a estrutura de dados esperada para a tabela `order_items` (incluindo o preço no momento da compra).
3. **Testando o Middleware:** Escrever testes que simulem requisições para `/admin` sem o cookie de sessão ou com uma role `client`, garantindo que o redirecionamento (Redirect) para a Home `/` ocorra com status 302.

---

## Fase 3: Testes de Segurança e RLS (Banco de Dados)
**Objetivo:** Garantir que clientes espertinhos não consigam alterar dados de outros ou acessar informações do painel admin.

1. **Testes de Isolamento (Client A vs Client B):** Simular uma query no Supabase como "Cliente A" tentando fazer um `SELECT` nos `addresses` do "Cliente B". O teste deve passar apenas se o retorno for vazio ou der erro de permissão (garantindo que o RLS funciona).
2. **Proteção de Produtos:** Simular um usuário comum (`role: 'client'`) tentando executar um `INSERT` na tabela de `products`. O banco deve rejeitar a transação.

---

## Fase 4: Testes End-to-End (E2E) com Playwright
**Objetivo:** Simular um usuário real abrindo o navegador, clicando e comprando. Estes são os testes mais importantes do e-commerce.

1. **Fluxo de Autenticação:**
   - O Playwright deve acessar `/login`, preencher e-mail e senha, clicar em entrar e verificar se foi redirecionado para a Home com a sessão ativa.
2. **Jornada de Compra do Cliente (Critical Path):**
   - Acessar a Home `/` e clicar em um Produto.
   - Preencher a personalização ("Bordar nome: Ana") e adicionar ao carrinho.
   - Ir para `/cart`, selecionar um endereço cadastrado.
   - Clicar em "Finalizar Pedido" e verificar se a tela de sucesso (`/profile/orders`) aparece com o status da compra.
3. **Fluxo do Administrador:**
   - Logar com credenciais de admin.
   - Acessar `/admin/products/new`.
   - Preencher um novo produto e verificar se ele aparece imediatamente na página principal para os clientes.

---

## Regras de Execução de Testes para a IA
- **Test-Driven Development (TDD) Opcional, mas recomendado:** Ao ser solicitada a criar uma Server Action complexa, a IA deve perguntar se o usuário deseja que ela escreva o teste de integração primeiro.
- **Nenhum "Any" nos Testes:** Assim como no `rules.md`, os testes devem usar tipagem estrita para os *mocks*.
- **Cobertura Focada:** Não perca tempo testando páginas estáticas de texto. Concentre os esforços (e os tokens) em testar o **Carrinho de Compras**, a **Autenticação** e as **Regras de Negócio (RLS)**.