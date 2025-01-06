import React, { useState } from "react";
import * as C from "./styles";
import Input from "../../components/LoginInput";
import LoginButton from "../../components/LoginButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status && data.token) {
        signin(email, data.token, data.admin);

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError("E-mail ou senha incorretos");
      }
    } catch (error) {
      setError("Erro ao tentar fazer login");
    }
  };

  return (
    <C.Container>
      <C.LoginTitleLabel>FAÇA SEU LOGIN</C.LoginTitleLabel>
      <C.Content>
        <C.LoginInputGroup>
          <C.LoginContentLabel>E-mail:</C.LoginContentLabel>
          <Input
            type="email"
            placeholder="Digite seu E-mail"
            value={email}
            onChange={(e) => [setEmail(e.target.value), setError("")]}
          />
        </C.LoginInputGroup>
        <C.LoginInputGroup>
          <C.LoginContentLabel>Senha:</C.LoginContentLabel>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => [setPassword(e.target.value), setError("")]}
          />
        </C.LoginInputGroup>
        <C.LabelError>{error}</C.LabelError>
        <LoginButton Text="Entrar" onClick={handleLogin} />
      </C.Content>
    </C.Container>
  );
};

export default Login;