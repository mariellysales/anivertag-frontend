import { createContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const secretKey = "SuaChaveSecretaGerada";

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  useEffect(() => {
    try {
      const encryptedUserToken = localStorage.getItem("authToken");
      const encryptedAdminData = localStorage.getItem("adminData");

      if (encryptedUserToken && encryptedAdminData) {
        const userToken = decryptData(encryptedUserToken);
        const adminData = decryptData(encryptedAdminData);

        if (userToken.email === adminData.email) {
          setAdmin(adminData);
        } else {
          signout();
        }
      }
    } catch (error) {
      signout();
    }
  }, []);

  const signin = (email, token, admin) => {
    const userToken = { email, token };
    const encryptedToken = encryptData(userToken);
    const encryptedAdmin = encryptData(admin);
    localStorage.setItem("authToken", encryptedToken);
    localStorage.setItem("adminData", encryptedAdmin);
    setAdmin(admin);
  };

  const signout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, signed: !!admin, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
