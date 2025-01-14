import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
`;

export const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  height: 85vh;
`;

export const Content = styled.div`
  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 1px 2px #0003;
  background-color: white;
  max-width: 350px;
  padding: 22px;
`;

export const LoginTitleLabel = styled.label`
  font-size: 18px;
  font-weight: 600;
  color: #676767;
`;

export const LoginContentLabel = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #676767;
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

export const LoginInputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: -webkit-fill-available;

  label {
    margin-right: 10px;
  }

  input {
    flex: 1;
  }
`;
