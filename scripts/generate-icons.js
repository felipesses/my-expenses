/**
 * Script para gerar ícones PNG a partir do SVG
 *
 * Para executar, você precisa instalar sharp:
 * npm install --save-dev sharp
 *
 * Depois execute: node scripts/generate-icons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-icon.png" },
];

const svgPath = path.join(__dirname, "../app/icon.svg");
const publicPath = path.join(__dirname, "../public");
const appPath = path.join(__dirname, "../app");

async function generateIcons() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);

    for (const { size, name } of sizes) {
      const outputPath =
        name === "apple-icon.png"
          ? path.join(appPath, name)
          : path.join(publicPath, name);

      await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);

      console.log(`✓ Gerado: ${name} (${size}x${size})`);
    }

    console.log("\n✅ Todos os ícones foram gerados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar ícones:", error.message);
    console.log('\n💡 Dica: Execute "npm install --save-dev sharp" primeiro');
    process.exit(1);
  }
}

generateIcons();
