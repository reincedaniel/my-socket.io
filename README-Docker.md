# 🐳 Deploy no Portainer com Docker

Este guia explica como fazer deploy do servidor WebSocket no Portainer usando Docker.

## 📋 Pré-requisitos

- Docker instalado e a correr
- Portainer instalado e configurado
- Acesso ao Portainer (web interface)

## 🚀 Métodos de Deploy

### 1. Deploy via Portainer Stack (Recomendado)

#### Passo 1: Preparar a Imagem
```bash
# Construir a imagem Docker
docker build -t websocket-server:latest .

# Opcional: Fazer push para um registry
docker tag websocket-server:latest your-registry/websocket-server:latest
docker push your-registry/websocket-server:latest
```

#### Passo 2: Deploy no Portainer
1. Abrir o Portainer
2. Ir para **Stacks** → **Add stack**
3. Nome: `websocket-server`
4. Copiar o conteúdo de `portainer-stack.yml`
5. Clicar em **Deploy the stack**

### 2. Deploy via Docker Compose

#### Desenvolvimento
```bash
# Deploy em modo desenvolvimento
./deploy.sh dev
# ou no Windows
deploy.bat dev
```

#### Produção
```bash
# Deploy em modo produção
./deploy.sh prod
# ou no Windows
deploy.bat prod
```

### 3. Deploy Manual

```bash
# Construir imagem
docker build -t websocket-server .

# Executar container
docker run -d \
  --name websocket-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --restart unless-stopped \
  websocket-server
```

## 🔧 Configuração do Portainer

### Variáveis de Ambiente
- `NODE_ENV`: `production` ou `development`
- `PORT`: Porta do servidor (padrão: 3000)

### Portas
- **3000**: Servidor WebSocket e HTTP

### Volumes
- Nenhum volume necessário para produção
- Para desenvolvimento: `.:/app` (hot-reload)

### Networks
- `websocket-network`: Rede isolada para a aplicação

## 📊 Monitorização

### Health Check
O container inclui um health check que verifica:
- Endpoint `/health` a cada 30 segundos
- Timeout de 10 segundos
- 3 tentativas antes de marcar como não saudável

### Logs
- Driver: `json-file`
- Tamanho máximo: 10MB por arquivo
- Máximo 3 arquivos de log

### Recursos
- **CPU**: Limite de 0.5 cores, reserva de 0.25 cores
- **Memória**: Limite de 512MB, reserva de 256MB

## 🚨 Troubleshooting

### Container não inicia
```bash
# Ver logs
docker logs websocket-server

# Verificar status
docker ps -a | grep websocket-server
```

### Porta já em uso
```bash
# Verificar que está a usar a porta 3000
netstat -ano | findstr :3000

# Parar outros serviços na porta 3000
# ou alterar a porta no docker-compose.yml
```

### Problemas de rede
```bash
# Verificar networks
docker network ls

# Verificar conectividade
docker exec websocket-server wget -qO- http://localhost:3000/health
```

## 🔄 Atualizações

### Atualizar a aplicação
```bash
# Parar o stack
# Fazer pull da nova imagem
docker pull websocket-server:latest

# Reiniciar o stack
```

### Rollback
```bash
# Voltar para versão anterior
docker tag websocket-server:previous websocket-server:latest
docker restart websocket-server
```

## 📱 Acesso Externo

### Rede Local
- A aplicação está acessível em todos os IPs da rede local
- Use o IP do servidor: `http://[IP_SERVIDOR]:3000`

### Traefik (se configurado)
- Labels configurados para Traefik
- Acessível via `websocket.local` (configurar DNS local)

## 🛡️ Segurança

### Recomendações
- Use secrets para credenciais sensíveis
- Configure firewall para limitar acesso
- Use HTTPS em produção
- Implemente autenticação se necessário

### Isolamento
- Container roda como usuário não-root (UID 1001)
- Rede isolada
- Recursos limitados

## 📚 Comandos Úteis

```bash
# Ver logs em tempo real
docker logs -f websocket-server

# Entrar no container
docker exec -it websocket-server sh

# Ver estatísticas
docker stats websocket-server

# Reiniciar container
docker restart websocket-server

# Parar e remover
docker stop websocket-server
docker rm websocket-server
```

## 🔗 Links Úteis

- **Portainer**: Interface web para gestão de Docker
- **Docker Compose**: Orquestração de containers
- **Traefik**: Reverse proxy e load balancer
- **Docker Hub**: Registry de imagens Docker

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs do container
2. Verificar configuração do Portainer
3. Verificar conectividade de rede
4. Consultar documentação do Docker
