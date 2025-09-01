#!/bin/bash

# Script de deploy para o Portainer
# Uso: ./deploy.sh [dev|prod]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Verificar se o Docker está a correr
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está a correr. Inicie o Docker e tente novamente."
        exit 1
    fi
    log "Docker está a correr"
}

# Verificar se o docker-compose está disponível
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose não está instalado. Instale o docker-compose e tente novamente."
        exit 1
    fi
    log "docker-compose está disponível"
}

# Build da imagem
build_image() {
    local env=$1
    log "A construir imagem para ambiente: $env"
    
    if [ "$env" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml build
    else
        docker-compose -f docker-compose.prod.yml build
    fi
    
    log "Imagem construída com sucesso"
}

# Deploy da aplicação
deploy_app() {
    local env=$1
    log "A fazer deploy da aplicação para ambiente: $env"
    
    if [ "$env" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml up -d
    else
        docker-compose -f docker-compose.prod.yml up -d
    fi
    
    log "Aplicação deployada com sucesso"
}

# Verificar status da aplicação
check_status() {
    log "A verificar status da aplicação..."
    
    # Aguardar um pouco para a aplicação inicializar
    sleep 5
    
    # Verificar se o container está a correr
    if docker ps | grep -q websocket-server; then
        log "Container está a correr"
        
        # Testar endpoint de health
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log "✅ Aplicação está a funcionar corretamente"
            log "🌐 Acessível em: http://localhost:3000"
            log "📡 Endpoint de teste: http://localhost:3000/test"
        else
            warn "Aplicação pode não estar completamente inicializada"
        fi
    else
        error "Container não está a correr"
        exit 1
    fi
}

# Função principal
main() {
    local env=${1:-prod}
    
    log "🚀 Iniciando deploy do WebSocket Server"
    log "Ambiente: $env"
    
    # Verificações
    check_docker
    check_docker_compose
    
    # Build e deploy
    build_image "$env"
    deploy_app "$env"
    
    # Verificar status
    check_status
    
    log "🎉 Deploy concluído com sucesso!"
    
    # Mostrar comandos úteis
    echo
    log "Comandos úteis:"
    echo "  - Ver logs: docker-compose -f docker-compose.$env.yml logs -f"
    echo "  - Parar: docker-compose -f docker-compose.$env.yml down"
    echo "  - Reiniciar: docker-compose -f docker-compose.$env.yml restart"
    echo "  - Status: docker-compose -f docker-compose.$env.yml ps"
}

# Verificar argumentos
if [ "$1" != "dev" ] && [ "$1" != "prod" ] && [ -n "$1" ]; then
    error "Uso: $0 [dev|prod]"
    error "  dev  - Ambiente de desenvolvimento"
    error "  prod - Ambiente de produção (padrão)"
    exit 1
fi

# Executar função principal
main "$@"
