import styled from "styled-components";

export const Input = styled.input`
  outline: none;
  padding: 10px 20px;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;

  background-color: #f0f2f5;
  border: none;

  &:disabled {
    background-color: #c5c9d1;
    cursor: not-allowed;
  }
`;
