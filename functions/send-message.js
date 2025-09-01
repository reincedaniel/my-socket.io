// Armazenamento temporário em memória (em produção, use um banco de dados)
let messageStore = new Map(); // userId -> array de mensagens
let messageCounter = 0;

exports.handler = async (event, context) => {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Verificar se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Método não permitido',
        message: 'Use POST para enviar mensagens'
      })
    };
  }

  try {
    // Parse do corpo da requisição
    const body = JSON.parse(event.body);
    const { userId, action } = body;

    // Validação dos campos obrigatórios
    if (!userId || !action) {
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Campos obrigatórios ausentes',
          message: 'userId e action são obrigatórios'
        })
      };
    }

    // Criar nova mensagem
    const message = {
      id: ++messageCounter,
      userId,
      action,
      timestamp: new Date().toISOString(),
      type: 'userAction'
    };

    // Armazenar mensagem
    if (!messageStore.has(userId)) {
      messageStore.set(userId, []);
    }
    messageStore.get(userId).push(message);

    // Manter apenas as últimas 100 mensagens por usuário
    const userMessages = messageStore.get(userId);
    if (userMessages.length > 100) {
      userMessages.splice(0, userMessages.length - 100);
    }

    console.log(`Mensagem enviada: ${userId} -> ${action}`);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: {
          id: message.id,
          userId: message.userId,
          action: message.action,
          timestamp: message.timestamp
        }
      })
    };
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);

    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        message: error.message
      })
    };
  }
};
