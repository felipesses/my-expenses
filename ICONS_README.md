# Ícones da Aplicação

Este documento explica como gerar os ícones PNG necessários para Android, iOS e Web a partir do arquivo SVG.

## Arquivos Necessários

- `app/icon.svg` - Ícone SVG principal (já criado)
- `app/apple-icon.png` - Ícone para iOS (180x180)
- `public/icon-192.png` - Ícone para Android/Web (192x192)
- `public/icon-512.png` - Ícone para Android/Web (512x512)

## Como Gerar os Ícones PNG

### Opção 1: Usando o Script Automatizado

1. Instale a dependência `sharp`:
```bash
npm install --save-dev sharp
```

2. Execute o script:
```bash
node scripts/generate-icons.js
```

### Opção 2: Usando Ferramentas Online

1. Acesse um conversor SVG para PNG online (ex: https://convertio.co/svg-png/)
2. Faça upload do arquivo `app/icon.svg`
3. Gere os seguintes tamanhos:
   - 180x180 → Salve como `app/apple-icon.png`
   - 192x192 → Salve como `public/icon-192.png`
   - 512x512 → Salve como `public/icon-512.png`

### Opção 3: Usando ImageMagick (se instalado)

```bash
# Apple Icon (iOS)
convert app/icon.svg -resize 180x180 app/apple-icon.png

# Android/Web Icons
convert app/icon.svg -resize 192x192 public/icon-192.png
convert app/icon.svg -resize 512x512 public/icon-512.png
```

## Verificação

Após gerar os ícones, verifique se os arquivos foram criados nos locais corretos:

- ✅ `app/icon.svg` (já existe)
- ✅ `app/apple-icon.png`
- ✅ `public/icon-192.png`
- ✅ `public/icon-512.png`
- ✅ `public/manifest.json` (já existe)

## Suporte

- **Web**: O Next.js usa automaticamente `app/icon.svg` como favicon
- **iOS**: Usa `app/apple-icon.png` para ícone na tela inicial
- **Android**: Usa os ícones definidos em `public/manifest.json`

