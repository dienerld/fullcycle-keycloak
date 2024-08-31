// errors.ts

export const ErrorCodes = {
  AUTH: {
    INVALID_TOKEN: {
      code: 'AUTH_001',
      message: 'Token de autenticação inválido ou expirado.',
      httpCode: 401,
    },
    USER_NOT_FOUND: {
      code: 'AUTH_002',
      message: 'Usuário não encontrado.',
      httpCode: 404,
    },
  },
  VALIDATION: {
    INVALID_REQUEST: {
      code: 'VALIDATION_001',
      message: 'Dados de requisição inválidos.',
      httpCode: 400,
    },
    MISSING_FIELDS: {
      code: 'VALIDATION_002',
      message: 'Campos obrigatórios ausentes.',
      httpCode: 400,
    },
  },
  SERVER: {
    INTERNAL_ERROR: {
      code: 'SERVER_001',
      message:
        'Erro interno do servidor. Por favor, tente novamente mais tarde.',
      httpCode: 500,
    },
  },
  // Adicione mais categorias de erros conforme necessário
};

export type ErrorCode = keyof typeof ErrorCodes;
