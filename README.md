# Servidor WebSocket - Base

Servidor WebSocket com endpoints HTTP de teste, configurado para funcionar na rede local.

## 🚀 Funcionalidades

- **WebSocket Server**: Comunicação em tempo real entre dispositivos
- **Endpoints HTTP**: Teste e monitorização do servidor
- **Rede Local**: Acessível de outros dispositivos na mesma rede
- **Interface Web**: Página de teste interativa

## 📡 Endpoints Disponíveis

### HTTP
- `GET /` - Página de teste interativa
- `GET /test` - Status do servidor (JSON)
- `GET /health` - Health check detalhado (JSON)

### WebSocket
- `/socket.io/` - Conexão WebSocket

## 🛠️ Instalação e Uso

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor
```bash
npm start
```

ou

```bash
node index.js
```

### 3. Aceder ao servidor

**Local:**
- http://localhost:3000
- http://127.0.0.1:3000

**Rede Local:**
- http://[IP_DA_REDE]:3000
- O servidor mostrará automaticamente os IPs disponíveis no console

## 🔌 WebSocket Events

### Cliente → Servidor
- `joinRoom(userId)` - Entrar numa sala específica
- `userAction({ userId, action })` - Enviar ação para outros dispositivos do mesmo user

### Servidor → Cliente
- `userAction(action)` - Receber ação de outro dispositivo

## 🌐 Configuração de Rede

O servidor está configurado para:
- **Host**: `0.0.0.0` (acessível na rede local)
- **Porta**: `3000` (configurável via variável de ambiente `PORT`)
- **CORS**: Permitido para todas as origens

## 📱 Teste em Dispositivos Móveis

1. Inicie o servidor no computador
2. Anote o IP da rede local mostrado no console
3. No dispositivo móvel, aceda a `http://[IP]:3000`
4. Teste os endpoints e WebSocket

## 🔧 Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 3000)

## 📊 Monitorização

O servidor inclui:
- Logs de conexões WebSocket
- Endpoint de health check
- Interface web de teste
- Informações de rede no console

## 🚨 Segurança

**Nota**: Este servidor está configurado para desenvolvimento e teste. Para produção:
- Configure CORS adequadamente
- Implemente autenticação
- Use HTTPS
- Configure firewall adequadamente
