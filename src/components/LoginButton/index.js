import React from "react";
import * as C from "./styles";

const LoginButton = ({ Text, onClick, Type = "button" }) => {
  return (
    <C.LoginButton type={Type} onClick={onClick}>
      {Text}
    </C.LoginButton>
  );
};

export default LoginButton;
