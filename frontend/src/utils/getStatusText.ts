const getStatusText = (status: string) => {
  switch (status) {
    case 'VALIDATED':
    return 'Usuário Validado';
    case 'REJECTED':
    return 'Validação Rejeitada';
    default:
    return 'Validação Pendente';
  }
};

export default getStatusText;