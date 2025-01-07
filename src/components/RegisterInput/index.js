import React from "react";
import * as C from "./styles";

const RegisterInput = ({
  type,
  placeholder,
  value,
  onChange,
  style,
  disabled,
  maxLength,
}) => {
  return (
    <C.Input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      maxLength={maxLength}
    />
  );
};

export default RegisterInput;
