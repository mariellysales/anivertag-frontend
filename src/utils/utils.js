export const maskCPF = (value) => {
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length <= 3) {
    return cleanValue;
  }
  if (cleanValue.length <= 6) {
    return cleanValue.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  }
  if (cleanValue.length <= 9) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  }
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
};
