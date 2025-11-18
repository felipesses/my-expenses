# My Expenses

Aplicação de controle financeiro pessoal desenvolvida com Next.js, Prisma e Firebase Authentication.

## 🚀 Funcionalidades

- ✅ Autenticação com Firebase
- ✅ Controle de Renda, Despesas e Economias
- ✅ Dashboard com métricas financeiras
- ✅ Visualização por mês/ano
- ✅ Gráficos de despesas por categoria
- ✅ Recomendação de reserva de emergência
- ✅ Interface responsiva (mobile, tablet, desktop)

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **Prisma** - ORM para banco de dados
- **Neon DB** - Banco de dados PostgreSQL
- **Firebase Auth** - Autenticação de usuários
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **shadcn/ui** - Componentes UI

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Neon DB
- Projeto Firebase configurado

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/my-expenses.git
cd my-expenses
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
- `DATABASE_URL` - URL do banco Neon DB
- Variáveis do Firebase (NEXT_PUBLIC_FIREBASE_*)

4. Configure o banco de dados:
```bash
npm run db:push
```

5. Execute o projeto:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run db:push` - Sincroniza schema com o banco
- `npm run db:studio` - Abre Prisma Studio

## 📱 Estrutura do Projeto

```
my-expenses/
├── app/                    # Páginas Next.js (App Router)
│   ├── api/               # API Routes
│   ├── login/             # Página de login
│   ├── transacao/         # Páginas de transações
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes React
├── contexts/              # Context API
├── lib/                   # Utilitários e configurações
├── prisma/                # Schema do Prisma
└── public/                # Arquivos estáticos
```

## 🔐 Segurança

- Autenticação obrigatória para todas as rotas
- Isolamento de dados por usuário
- Variáveis sensíveis em `.env` (não commitadas)

## 📄 Licença

Este projeto é privado.
