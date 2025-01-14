import styled from "styled-components";

export const LoginButton = styled.button`
  padding: 16px 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  background-color: rgb(103, 27, 125);
  color: white;
  font-weight: 600;
  font-size: 16px;
  max-width: 350px;

  &:hover {
    background-color: #4e0e58;
  }

  &:disabled {
    background-color: #9b4d99;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
