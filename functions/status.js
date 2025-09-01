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

  try {
    const statusData = {
      status: 'online',
      message: 'Sistema funcionando no Netlify!',
      timestamp: new Date().toISOString(),
      environment: 'netlify',
      endpoints: {
        status: '/api/status',
        health: '/api/health',
        sendMessage: '/api/send-message',
        getMessages: '/api/messages'
      },
      note: 'Esta versão usa HTTP em vez de WebSocket devido às limitações do Netlify'
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    };
  } catch (error) {
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
