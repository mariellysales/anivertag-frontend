import React from "react";
import * as C from "./styles";

const HomeInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  maxLength,
  pattern,
}) => {
  return (
    <C.HomeInput
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
    />
  );
};

export default HomeInput;
