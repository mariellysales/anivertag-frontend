import React from "react";
import * as C from "./styles";

const LoginButton = ({ Text, onClick, Type = "button", disabled }) => {
  return (
    <C.LoginButton type={Type} onClick={onClick} disabled={disabled}>
      {Text}
    </C.LoginButton>
  );
};

export default LoginButton;
