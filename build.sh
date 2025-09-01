#!/bin/bash

echo "🚀 Preparando projeto para deploy no Netlify..."

# Criar pasta public se não existir
if [ ! -d "public" ]; then
    echo "📁 Criando pasta public..."
    mkdir -p public
fi

# Copiar arquivos estáticos
echo "📋 Copiando arquivos estáticos..."
cp index.html public/ 2>/dev/null || echo "⚠️ index.html não encontrado, usando versão do Netlify"

# Verificar se as funções existem
if [ -d "functions" ]; then
    echo "✅ Pasta functions encontrada"
else
    echo "❌ Pasta functions não encontrada!"
    exit 1
fi

# Verificar se netlify.toml existe
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml encontrado"
else
    echo "❌ netlify.toml não encontrado!"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar estrutura final
echo ""
echo "📁 Estrutura do projeto preparado:"
echo "├── functions/           # Funções serverless"
echo "├── public/             # Arquivos estáticos"
echo "├── netlify.toml        # Configuração"
echo "└── package.json        # Dependências"
echo ""

echo "✅ Projeto preparado para deploy no Netlify!"
echo ""
echo "🚀 Para fazer deploy:"
echo "1. Faça push para o Git"
echo "2. Conecte o repositório ao Netlify"
echo "3. Configure:"
echo "   - Build command: npm run build"
echo "   - Publish directory: public"
echo "   - Functions directory: functions"
echo ""
echo "📚 Consulte README-Netlify.md para mais detalhes"
