# Deploy na Vercel - My Expenses

Guia completo para fazer deploy do projeto na Vercel.

## 📋 Pré-requisitos

- ✅ Repositório no GitHub (já configurado: https://github.com/felipesses/my-expenses)
- ✅ Conta na Vercel (crie em [vercel.com](https://vercel.com))
- ✅ Projeto Firebase configurado
- ✅ Banco Neon DB configurado

## 🚀 Passo a Passo

### 1. Acesse a Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New..." → "Project"

### 2. Importe o Repositório

1. Na lista de repositórios, encontre `felipesses/my-expenses`
2. Clique em "Import"

### 3. Configure o Projeto

A Vercel detectará automaticamente que é um projeto Next.js. Configure:

**Project Settings:**
- **Framework Preset**: Next.js (já detectado)
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

### 4. Configure as Variáveis de Ambiente

**IMPORTANTE:** Adicione todas as variáveis de ambiente antes de fazer deploy:

Clique em "Environment Variables" e adicione:

#### Banco de Dados
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

#### Firebase
```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

#### URL da Aplicação (opcional)
```
NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
```

**Selecione os ambientes:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build (pode levar 2-5 minutos)
3. A Vercel fornecerá uma URL: `https://seu-projeto.vercel.app`

## 🔧 Configurações Adicionais

### Build Settings

A Vercel detecta automaticamente o Next.js, mas você pode verificar:

- **Node.js Version**: 18.x ou superior
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Domínio Customizado (Opcional)

1. Vá em Settings → Domains
2. Adicione seu domínio personalizado
3. Siga as instruções de DNS

## 🗄️ Configuração do Banco de Dados

### Neon DB

1. Certifique-se de que o banco está acessível publicamente
2. Use a connection string completa no `DATABASE_URL`
3. A Vercel se conectará automaticamente ao banco

### Prisma

A Vercel executará automaticamente:
- `prisma generate` durante o build
- Você pode precisar executar `prisma db push` manualmente após o primeiro deploy

**Para executar migrations na Vercel:**

1. Vá em Settings → Environment Variables
2. Adicione um script de build customizado (se necessário)

Ou execute manualmente via terminal:
```bash
npx prisma db push
```

## 🔐 Segurança

### Variáveis de Ambiente

- ✅ Nunca commite o arquivo `.env`
- ✅ Todas as variáveis sensíveis devem estar na Vercel
- ✅ Use diferentes variáveis para Production/Preview/Development se necessário

### Firebase

- ✅ Configure domínios autorizados no Firebase Console
- ✅ Adicione a URL da Vercel em "Authorized domains"

## 📊 Monitoramento

Após o deploy, você terá acesso a:

- **Deployments**: Histórico de deploys
- **Analytics**: Métricas de performance
- **Logs**: Logs de build e runtime
- **Functions**: Logs das API routes

## 🐛 Troubleshooting

### Erro de Build

1. Verifique os logs em Deployments → [último deploy] → Build Logs
2. Certifique-se de que todas as variáveis de ambiente estão configuradas
3. Verifique se o Node.js version está correto

### Erro de Conexão com Banco

1. Verifique se o `DATABASE_URL` está correto
2. Certifique-se de que o Neon DB permite conexões externas
3. Verifique se o SSL está habilitado (`?sslmode=require`)

### Erro de Firebase

1. Verifique se todas as variáveis `NEXT_PUBLIC_FIREBASE_*` estão configuradas
2. Adicione o domínio da Vercel no Firebase Console
3. Verifique se as credenciais estão corretas

## 🔄 Deploy Automático

A Vercel faz deploy automático quando:
- ✅ Você faz push para a branch `main` (production)
- ✅ Você cria um Pull Request (preview)
- ✅ Você faz push para outras branches (preview)

## 📝 Próximos Passos

1. ✅ Configure as variáveis de ambiente
2. ✅ Faça o primeiro deploy
3. ✅ Teste a aplicação na URL fornecida
4. ✅ Configure domínio customizado (opcional)
5. ✅ Configure analytics (opcional)

## 🎉 Pronto!

Sua aplicação estará disponível em `https://seu-projeto.vercel.app`

Para atualizações futuras, basta fazer push para o GitHub e a Vercel fará deploy automaticamente!

