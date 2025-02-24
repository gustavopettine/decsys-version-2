const formatCpf = (cpf: string) => {
  cpf = cpf.replace(/\D/g, "");

  return cpf
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export default formatCpf