# Configuração do Firebase Authentication

## Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Preencha o nome do projeto
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Habilitar Authentication

1. No menu lateral, clique em "Authentication"
2. Clique em "Get started"
3. Na aba "Sign-in method", clique em "Email/Password"
4. Ative "Email/Password" e clique em "Save"

### 3. Obter Credenciais

1. No menu lateral, clique no ícone de engrenagem ⚙️ ao lado de "Project Overview"
2. Clique em "Project settings"
3. Role até "Your apps" e clique no ícone da web `</>`
4. Registre um app (se ainda não tiver)
5. Copie as credenciais do Firebase

### 4. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto e adicione:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

### 5. Atualizar Schema do Banco

Após configurar o Firebase, execute:

```bash
npm run db:push
```

Isso atualizará o schema do banco de dados para incluir o campo `userId` nas transações.

## Estrutura de Autenticação

- **Login/Cadastro**: `/login` - Tela de autenticação
- **Dashboard**: `/` - Página principal (protegida)
- Cada usuário vê apenas suas próprias transações
- As transações são filtradas por `userId` no banco de dados

## Segurança

⚠️ **Importante**: A implementação atual usa o `userId` no header das requisições. Para produção, considere:

1. Implementar verificação de token JWT do Firebase no servidor
2. Usar Firebase Admin SDK para validar tokens
3. Adicionar middleware de autenticação nas rotas da API

## Testando

1. Acesse `http://localhost:3000/login`
2. Crie uma conta ou faça login
3. Você será redirecionado para o dashboard
4. Cada usuário terá seus próprios gastos isolados

