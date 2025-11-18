# Guia Rápido de Configuração

## Passo a Passo

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

#### Opção A: Neon DB (Recomendado)
1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string
5. Crie o arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="sua-connection-string-aqui"
```

#### Opção B: PostgreSQL Local
Se preferir usar PostgreSQL local:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/myexpenses"
```

### 3. Configurar Prisma
```bash
# Gerar o cliente Prisma
npm run db:generate

# Aplicar o schema ao banco de dados
npm run db:push
```

### 4. Executar o Projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Comandos Úteis

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Produção
- `npm run db:studio` - Abrir Prisma Studio (interface visual do banco)

## Estrutura de Arquivos Importantes

- `app/page.tsx` - Página principal
- `app/api/transacoes/` - API routes
- `prisma/schema.prisma` - Schema do banco
- `lib/prisma.ts` - Cliente Prisma
- `.env` - Variáveis de ambiente (não commitado)

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
Execute: `npm run db:generate`

### Erro de conexão com banco
Verifique se a `DATABASE_URL` no `.env` está correta

### Erro: "Table does not exist"
Execute: `npm run db:push`

