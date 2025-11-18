# Como adicionar o projeto ao GitHub

## Passo 1: Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Preencha:
   - **Repository name**: `meus-gastos`
   - **Description**: "Aplicação de controle financeiro pessoal"
   - **Visibility**: Escolha Privado ou Público
   - **NÃO** marque "Initialize with README" (já temos um)
5. Clique em "Create repository"

## Passo 2: Conectar o repositório local ao GitHub

Execute os seguintes comandos no terminal (substitua `SEU_USUARIO` pelo seu username do GitHub):

```bash
cd C:\Users\USER\Downloads\my-expenses-example

# Adicionar o remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/meus-gastos.git

# Renomear a branch para main (se necessário)
git branch -M main

# Enviar o código para o GitHub
git push -u origin main
```

## Passo 3: Verificar

Acesse seu repositório no GitHub e verifique se todos os arquivos foram enviados corretamente.

## ⚠️ Importante

Antes de fazer push, certifique-se de que:
- O arquivo `.env` está no `.gitignore` (já está)
- Não há informações sensíveis no código
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

