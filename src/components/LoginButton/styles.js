import styled from "styled-components";

export const LoginButton = styled.button`
  padding: 16px 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  background-color: rgb(130, 74, 220);
  color: white;
  font-weight: 600;
  font-size: 16px;
  max-width: 350px;

  &:hover {
    background-color: rgb(102, 59, 173);
  }

  &:disabled {
    background-color: rgba(130, 74, 220, 0.79);
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
