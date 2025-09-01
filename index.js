// server.js
const { Server } = require("socket.io");
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Endpoint de teste
  if (req.method === 'GET' && parsedUrl.pathname === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      message: 'Servidor WebSocket está a funcionar!',
      timestamp: new Date().toISOString(),
      endpoints: {
        websocket: '/socket.io/',
        test: '/test'
      }
    }));
    return;
  }
  
  // Endpoint de health check
  if (req.method === 'GET' && parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Endpoint raiz
  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Servidor WebSocket - Teste</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
            .endpoint h3 { margin: 0 0 10px 0; color: #007bff; }
            .endpoint code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
            .status { text-align: center; margin: 20px 0; }
            .status.online { color: #28a745; }
            .status.offline { color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Servidor WebSocket - Teste</h1>
            <div class="status online">
              <h2>✅ Servidor Online</h2>
              <p>Servidor WebSocket está a funcionar na rede!</p>
            </div>
            
            <div class="endpoint">
              <h3>📡 Endpoint de Teste</h3>
              <p><code>GET /test</code> - Verifica se o servidor está online</p>
              <button onclick="testEndpoint()">Testar Endpoint</button>
              <div id="testResult"></div>
            </div>
            
            <div class="endpoint">
              <h3>💓 Health Check</h3>
              <p><code>GET /health</code> - Status detalhado do servidor</p>
              <button onclick="healthCheck()">Verificar Saúde</button>
              <div id="healthResult"></div>
            </div>
            
            <div class="endpoint">
              <h3>🔌 WebSocket</h3>
              <p><code>/socket.io/</code> - Conexão WebSocket</p>
              <p>Porta: <strong>3000</strong></p>
              <p>Rede: <strong>0.0.0.0</strong> (acessível na rede local)</p>
            </div>
          </div>
          
          <script>
            async function testEndpoint() {
              try {
                const response = await fetch('/test');
                const data = await response.json();
                document.getElementById('testResult').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              } catch (error) {
                document.getElementById('testResult').innerHTML = '<p style="color: red;">Erro: ' + error.message + '</p>';
              }
            }
            
            async function healthCheck() {
              try {
                const response = await fetch('/health');
                const data = await response.json();
                document.getElementById('healthResult').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              } catch (error) {
                document.getElementById('healthResult').innerHTML = '<p style="color: red;">Erro: ' + error.message + '</p>';
              }
            }
          </script>
        </body>
      </html>
    `);
    return;
  }
  
  // Endpoint não encontrado
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
});

const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
});

io.on("connection", (socket) => {
  /* console.log("Novo cliente conectado:", socket.id); */

  // Entrar numa "sala" baseada no ID do user
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    /* console.log(`Cliente ${socket.id} entrou na sala: ${userId}`); */
  });

  // Escutar ações e replicar para outros dispositivos do mesmo user
  socket.on("userAction", ({ userId, action }) => {
    /* console.log(`Ação do user ${userId}:`, action); */
    socket.to(userId).emit("userAction", action);
  });

  socket.on("disconnect", () => {
    /* console.log("Cliente desconectado:", socket.id); */
  });
});

// Configurar para funcionar na rede (0.0.0.0)
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  /* console.log(`🚀 Servidor WebSocket a correr na porta ${PORT}`);
  console.log(`🌐 Acessível na rede local em: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Endpoints disponíveis:`);
  console.log(`   - GET / (página de teste)`);
  console.log(`   - GET /test (status do servidor)`);
  console.log(`   - GET /health (health check)`);
  console.log(`   - WebSocket: /socket.io/`); */
  
  // Mostrar IPs da rede local
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  /* console.log(`📡 IPs da rede local:`); */
  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`   - http://${net.address}:${PORT}`);
      }
    });
  });
});
