interface ErrorDetail {
  code: string
  message: string
  userMessage: string
  technicalDetails?: string
}

export const DatavalidErrors: Record<string, ErrorDetail> = {
  DV001: {
    code: 'DV001',
    message: 'LGPD: Dados de menor de idade',
    userMessage: 'Não é possível validar dados de menores de idade.',
    technicalDetails: 'O Datavalid não valida dados de criança e adolescente',
  },
  DV002: {
    code: 'DV002',
    message: 'Dados encontrados na base não atendem aos requisitos mínimos',
    userMessage:
      'Não foi possível validar seus dados. As informações disponíveis não são suficientes.',
    technicalDetails:
      'Dados na base do Senatran não atendem aos requisitos mínimos para validação',
  },
  DV010: {
    code: 'DV010',
    message: 'CPF inválido',
    userMessage:
      'O CPF informado é inválido. Por favor, verifique e tente novamente.',
  },
  DV011: {
    code: 'DV011',
    message: 'Nacionalidade inválida',
    userMessage:
      'A nacionalidade informada é inválida. Por favor, selecione uma opção válida.',
  },
  DV012: {
    code: 'DV012',
    message: 'Tipo do documento inválido',
    userMessage:
      'O tipo de documento selecionado é inválido. Por favor, escolha uma opção válida.',
  },
  DV013: {
    code: 'DV013',
    message: 'Sexo inválido',
    userMessage:
      'O sexo informado é inválido. Por favor, selecione uma opção válida.',
  },
  DV014: {
    code: 'DV014',
    message: 'Situação do CPF inválido',
    userMessage: 'A situação do CPF informada é inválida.',
  },
  DV016: {
    code: 'DV016',
    message: 'Código da situação da CNH inválido',
    userMessage: 'A situação da CNH informada é inválida.',
  },
  DV017: {
    code: 'DV017',
    message: 'Descrição da situação da CNH inválida',
    userMessage: 'A descrição da situação da CNH é inválida.',
  },
  DV018: {
    code: 'DV018',
    message: 'UF inválida',
    userMessage:
      'O estado (UF) informado é inválido. Por favor, selecione um estado válido.',
  },
  DV020: {
    code: 'DV020',
    message: 'CNPJ inválido',
    userMessage:
      'O CNPJ informado é inválido. Por favor, verifique e tente novamente.',
  },
  // Erros relacionados a biometria facial
  DV040: {
    code: 'DV040',
    message: 'Imagem da face não encontrada nas bases',
    userMessage:
      'Não encontramos uma foto do seu rosto em nossa base de dados.',
  },
  DV041: {
    code: 'DV041',
    message: 'Não foi possível reconhecer a face na imagem',
    userMessage:
      'Não foi possível identificar um rosto na foto enviada. Por favor, envie uma nova foto onde seu rosto esteja claramente visível.',
  },
  DV042: {
    code: 'DV042',
    message: 'Tamanho da imagem da face inválido',
    userMessage:
      'O tamanho da foto está incorreto. Por favor, envie uma nova foto seguindo as orientações.',
  },
  DV043: {
    code: 'DV043',
    message: 'Imagem da face corrompida ou fora do formato esperado',
    userMessage:
      'A foto enviada está corrompida ou em formato inválido. Por favor, tire uma nova foto.',
  },
  DV044: {
    code: 'DV044',
    message: 'Erro ao recuperar imagem da face codificada em base64',
    userMessage:
      'Houve um erro ao processar sua foto. Por favor, tente novamente.',
  },
  DV045: {
    code: 'DV045',
    message: 'Qualidade baixa da imagem da face',
    userMessage:
      'A qualidade da foto está baixa. Por favor, envie uma foto com melhor iluminação e nitidez.',
  },
  DV046: {
    code: 'DV046',
    message: 'Foi reconhecido mais de uma face na imagem',
    userMessage:
      'Foi identificado mais de um rosto na foto. Por favor, envie uma foto apenas com o seu rosto.',
  },
  DV047: {
    code: 'DV047',
    message: 'Formato da imagem da face inválido',
    userMessage:
      'O formato da foto é inválido. Por favor, use apenas os formatos aceitos (JPG ou PNG).',
  },
  // Erros de Liveness (Prova de Vida)
  DV061: {
    code: 'DV061',
    message: 'Baixa qualidade da imagem da face para checagem de vivacidade',
    userMessage:
      'A qualidade da foto não é suficiente para a prova de vida. Por favor, tire uma nova foto em um ambiente bem iluminado.',
  },
  DV062: {
    code: 'DV062',
    message: 'Imagem da face não foi reconhecida como real',
    userMessage:
      'Não foi possível confirmar que a foto é de uma pessoa real. Por favor, siga as instruções e tente novamente.',
  },
  // Erros relacionados a documentos
  DV079: {
    code: 'DV079',
    message: 'Documento obrigatório',
    userMessage: 'É necessário enviar a foto da frente do documento.',
  },
  DV080: {
    code: 'DV080',
    message: 'Formato do documento inválido',
    userMessage:
      'O formato da foto do documento é inválido. Use apenas JPG ou PNG.',
  },
  DV082: {
    code: 'DV082',
    message: 'Arquivo do documento corrompido',
    userMessage:
      'A foto do documento está corrompida. Por favor, tire uma nova foto.',
  },
  DV084: {
    code: 'DV084',
    message: 'Documento não reconhecido como válido',
    userMessage:
      'O documento enviado não foi reconhecido como válido. Certifique-se de usar uma CNH no modelo atual.',
  },
  DV085: {
    code: 'DV085',
    message: 'Foi reconhecido mais de um documento',
    userMessage:
      'Foi identificado mais de um documento na foto. Envie apenas um documento por foto.',
  },
  DV086: {
    code: 'DV086',
    message: 'Não foi possível recuperar o CPF no documento',
    userMessage:
      'Não foi possível ler o CPF no documento. Envie uma foto mais nítida.',
  },
  DV087: {
    code: 'DV087',
    message: 'Não foi possível recuperar a foto da face no documento',
    userMessage:
      'Não foi possível identificar a foto no documento. Envie uma foto mais nítida.',
  },
  DV088: {
    code: 'DV088',
    message: 'CPF informado não pertence ao documento',
    userMessage: 'O CPF informado não corresponde ao CPF do documento.',
  },
  // Erros de PIN e Prova de Vida
  DV170: {
    code: 'DV170',
    message: 'PIN não encontrado',
    userMessage:
      'O código PIN informado não foi encontrado. Verifique e tente novamente.',
  },
  DV171: {
    code: 'DV171',
    message: 'Prova de vida ainda não realizada',
    userMessage:
      'A prova de vida ainda não foi realizada. Por favor, complete o processo.',
  },
  DV172: {
    code: 'DV172',
    message: 'PIN expirado',
    userMessage: 'O código PIN expirou. Por favor, solicite um novo código.',
  },
  DV173: {
    code: 'DV173',
    message: 'Quantidade de tentativas excedida',
    userMessage:
      'Você excedeu o número máximo de tentativas. Por favor, aguarde e tente novamente mais tarde.',
  },
}

export const getDatavalidError = (code: string): ErrorDetail => {
  return (
    DatavalidErrors[code] || {
      code: 'UNKNOWN',
      message: 'Erro não identificado',
      userMessage:
        'Ocorreu um erro durante a validação. Por favor, tente novamente.',
    }
  )
}

// Função helper para verificar se é um erro de qualidade de imagem
export const isImageQualityError = (code: string): boolean => {
  const imageQualityErrors = ['DV034', 'DV045', 'DV061']
  return imageQualityErrors.includes(code)
}

// Função helper para verificar se é um erro de face
export const isFaceError = (code: string): boolean => {
  const faceErrors = [
    'DV040',
    'DV041',
    'DV042',
    'DV043',
    'DV044',
    'DV045',
    'DV046',
    'DV047',
  ]
  return faceErrors.includes(code)
}

// Função helper para verificar se é um erro de documento
export const isDocumentError = (code: string): boolean => {
  const documentErrors = [
    'DV079',
    'DV080',
    'DV082',
    'DV084',
    'DV085',
    'DV086',
    'DV087',
    'DV088',
  ]
  return documentErrors.includes(code)
}
