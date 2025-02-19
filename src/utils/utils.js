import CryptoJS from "crypto-js";

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

const secretKey = "SuaChaveSecretaGerada";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const getToken = () => {
  let token = localStorage.getItem("authToken");
  if (token) {
    token = decryptData(token);
    return token.token;
  }

  if (!token) {
    window.location.href = "/login";
    return;
  }
};

export const formatDate = (date) => {
  if (!date) return "";
  const newDate = new Date(date);
  const day = String(newDate.getDate() + 1).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};
