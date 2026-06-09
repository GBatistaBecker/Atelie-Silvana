# Task 2: Configuração do Supabase (Banco de Dados, Storage e Env Vars)

Esta tarefa foca em preparar o ambiente na nuvem do Supabase, rodar o script de criação das tabelas (PostgreSQL) e conectar o seu projeto Next.js local a esse banco de dados com total segurança.

---

## ☁️ Passo 1: Configuração no Painel do Supabase

1. **Criar Projeto:** Acesse o painel do Supabase, crie um novo projeto e dê o nome de `Atelie Silvana Becker`. Guarde bem a senha do banco de dados que você definir.
2. **Criar o Bucket no Storage:**
   - Vá em **Storage** no menu lateral.
   - Clique em **New Bucket**.
   - Dê o nome exato de `products`.
   - **⚠️ ATENÇÃO:** Ative a opção **"Public bucket"** (caso contrário, as fotos dos produtos não vão aparecer no site).

---

## Passo 2: Execução do Script SQL (Criação de Tabelas)

No painel do Supabase, clique em **SQL Editor** no menu lateral, abra uma nova aba de query (**New Query**) e execute o código abaixo para criar toda a estrutura do e-commerce:

```sql
-- 1. Criar Tabela de Perfis (Profiles) ligados ao Auth do Supabase
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS (Segurança) na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Criar Tabela de Endereços (Addresses)
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    zip_code TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 3. Criar Tabela de Produtos (Products)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Criar Tabela de Pedidos (Orders)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    address_id UUID NOT NULL REFERENCES public.addresses(id),
    total_price NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Criar Tabela de Itens do Pedido (Order_Items) - Onde fica a personalização do bordado
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC(10,2) NOT NULL,
    custom_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6. Trigger Automação: Criar Perfil no Banco Sempre que um Usuário Cadastrar no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
        new.email,
        'client' -- Novo usuário sempre inicia como cliente comum
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();