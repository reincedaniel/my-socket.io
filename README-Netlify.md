# 🚀 My Broker - Deploy no Netlify

Este projeto foi adaptado para funcionar no Netlify, uma plataforma de hosting estático que não suporta WebSockets persistentes.

## ⚠️ Limitações do Netlify

- **Não suporta WebSockets persistentes** - O Netlify é uma plataforma de hosting estático
- **Não suporta servidores Node.js persistentes** - Apenas funções serverless
- **Comunicação em tempo real limitada** - Usa polling HTTP em vez de WebSocket

## 🔄 Adaptações Feitas

### 1. Substituição de WebSocket por HTTP
- **Antes**: Comunicação em tempo real via Socket.IO
- **Agora**: Polling HTTP a cada 2 segundos para simular tempo real

### 2. Funções Serverless
- `/api/status` - Status do sistema
- `/api/health` - Health check
- `/api/send-message` - Enviar mensagens
- `/api/messages` - Buscar mensagens

### 3. Interface Adaptada
- Interface moderna e responsiva
- Indicadores visuais de conexão
- Log de eventos em tempo real
- Testes de endpoints integrados

## 🚀 Como Fazer Deploy

### Opção 1: Deploy via Git (Recomendado)

1. **Conecte seu repositório ao Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte com GitHub/GitLab/Bitbucket
   - Selecione este repositório

2. **Configure as opções de build:**
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Functions directory**: `functions`

3. **Deploy automático:**
   - O Netlify fará deploy automático a cada push
   - As funções serverless serão automaticamente configuradas

### Opção 2: Deploy Manual

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Faça o build:**
   ```bash
   npm run build
   ```

3. **Faça upload da pasta `public` para o Netlify:**
   - Arraste a pasta `public` para o Netlify
   - Ou use o CLI: `netlify deploy --dir=public --prod`

## 📁 Estrutura do Projeto

```
├── functions/           # Funções serverless do Netlify
│   ├── status.js       # Status do sistema
│   ├── health.js       # Health check
│   ├── send-message.js # Enviar mensagens
│   └── messages.js     # Buscar mensagens
├── public/             # Arquivos estáticos
│   └── index.html      # Interface principal
├── netlify.toml        # Configuração do Netlify
├── package.json        # Dependências e scripts
└── README-Netlify.md   # Esta documentação
```

## 🔧 Configuração

### netlify.toml
```toml
[build]
  publish = "public"
  functions = "functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Variáveis de Ambiente (Opcional)
No painel do Netlify, você pode configurar:
- `NODE_ENV`: `production`
- `LOG_LEVEL`: `info`

## 🧪 Testando

1. **Acesse a URL do seu site no Netlify**
2. **Digite um ID de usuário** (ex: `user123`)
3. **Clique em "Conectar"**
4. **Envie mensagens** e veja o log em tempo real
5. **Teste os endpoints** usando os botões de teste

## 📊 Monitoramento

### Logs das Funções
- Acesse o painel do Netlify
- Vá para "Functions" > "Logs"
- Veja os logs em tempo real

### Métricas
- **Requests**: Número de chamadas às funções
- **Duration**: Tempo de execução
- **Errors**: Erros e falhas

## 🔮 Melhorias Futuras

### Para Produção
1. **Banco de Dados**: Substituir armazenamento em memória por Redis/DynamoDB
2. **Autenticação**: Adicionar JWT ou OAuth
3. **Rate Limiting**: Limitar requisições por usuário
4. **Webhooks**: Notificações em tempo real via webhooks

### Alternativas para Tempo Real
1. **Pusher**: Serviço de WebSocket gerenciado
2. **Firebase**: Real-time database
3. **Supabase**: Real-time subscriptions
4. **Ably**: Plataforma de mensagens em tempo real

## 🐛 Troubleshooting

### Erro: "Function not found"
- Verifique se a pasta `functions` está no repositório
- Confirme se o `netlify.toml` está configurado corretamente

### Erro: "CORS policy"
- As funções já incluem headers CORS
- Verifique se não há configurações conflitantes

### Erro: "Build failed"
- Verifique se o Node.js 18+ está sendo usado
- Confirme se todas as dependências estão instaladas

## 📞 Suporte

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Netlify Functions**: [docs.netlify.com/functions](https://docs.netlify.com/functions)
- **Issues**: Abra uma issue no repositório

---

**Nota**: Esta é uma adaptação funcional para o Netlify. Para comunicação em tempo real verdadeira, considere usar uma das alternativas mencionadas acima.
