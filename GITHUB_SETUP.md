# Como adicionar o projeto ao GitHub

## Passo 1: Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Preencha:
   - **Repository name**: `my-expenses`
   - **Description**: "Aplicação de controle financeiro pessoal com Next.js"
   - **Visibility**: Escolha Privado ou Público
   - **NÃO** marque "Initialize with README" (já temos um)
   - **NÃO** adicione .gitignore ou license (já temos)
5. Clique em "Create repository"

## Passo 2: Conectar e enviar o código

Execute os seguintes comandos no terminal (substitua `SEU_USUARIO` pelo seu username do GitHub):

```bash
cd C:\Users\USER\Downloads\my-expenses-example

# Adicionar o remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/my-expenses.git

# Verificar se está na branch main
git branch

# Enviar o código para o GitHub
git push -u origin main
```

Se pedir autenticação, você pode:
- Usar um Personal Access Token (recomendado)
- Ou usar GitHub Desktop
- Ou configurar SSH keys

## Passo 3: Verificar

Acesse `https://github.com/SEU_USUARIO/my-expenses` e verifique se todos os arquivos foram enviados.

## ⚠️ Importante

- O arquivo `.env` está no `.gitignore` e não será enviado (correto!)
- Certifique-se de não ter informações sensíveis no código
- Todas as variáveis de ambiente estão documentadas no `env.example`

## Comandos úteis para o futuro

```bash
# Ver status das alterações
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push
```
