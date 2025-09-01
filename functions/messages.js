// Importar o store de mensagens (em produção, use um banco de dados compartilhado)
// Por simplicidade, vamos recriar o store aqui
// Em produção, considere usar Redis, DynamoDB, ou similar

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

  // Verificar se é uma requisição GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Método não permitido',
        message: 'Use GET para buscar mensagens'
      })
    };
  }

  try {
    // Parse dos query parameters
    const { userId, lastId = 0 } = event.queryStringParameters || {};

    // Validação dos campos obrigatórios
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Campo obrigatório ausente',
          message: 'userId é obrigatório'
        })
      };
    }

    // Simular busca de mensagens (em produção, use um banco de dados)
    // Por enquanto, retornamos mensagens simuladas para demonstração
    const mockMessages = [
      {
        id: parseInt(lastId) + 1,
        userId: userId,
        action: `Mensagem de teste ${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'userAction'
      }
    ];

    // Filtrar mensagens mais recentes que lastId
    const newMessages = mockMessages.filter(msg => msg.id > parseInt(lastId));

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        userId: userId,
        lastId: parseInt(lastId),
        messages: newMessages,
        count: newMessages.length,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);

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
