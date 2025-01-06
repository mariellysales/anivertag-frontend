import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  justify-content: space-around;
`;

export const Content = styled.div`
  gap: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  box-shadow: 0 1px 2px #0003;
  background-color: white;
  max-width: 40%;
  padding: 20px;
  border-radius: 5px;

  @media (max-width: 1350px) {
    max-width: 70%;
  }
`;

export const TitleRegisterLabel = styled.label`
  font-size: 18px;
  font-weight: 600;
  color: #676767;
  margin: 10px;
  text-align: center;
`;

export const RegisterContentLabel = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #676767;
`;

export const RegisterInputGroup = styled.div`
  display: flex;
  margin-bottom: 15px;
  width: -webkit-fill-available;
  flex-direction: column;

  label {
    margin-right: 10px;
  }

  input {
    flex: 1;
  }
`;

export const LabelError = styled.label`
  font-size: 14px;
  color: red;
`;

export const Strong = styled.strong`
  cursor: pointer;

  a {
    text-decoration: none;
    color: #676767;
  }
`;
