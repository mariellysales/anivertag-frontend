import styled from "styled-components";

export const Content = styled.div``;

export const Body = styled.div`
  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 1px 2px #0003;
  padding: 0px 20px;
`;

export const HomeInputGroup = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: inherit;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 16px;
  margin-right: auto;

  @media (max-width: 1000px) {
    margin-right: initial;
  }
`;

export const Button = styled.button`
  padding: 8px 16px;
  background-color: rgb(103, 27, 125);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #4e0e58;
  }

  &:disabled {
    background-color: #9b4d99;
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 425px) {
    font-size: 14px;
  }
`;

export const SelectButton = styled.button`
  background-color: transparent;
  border: none;
`;

export const TitleHomeLabel = styled.label`
  font-size: 20px;
  font-weight: 600;
  color: #676767;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Grid = styled.div`
  width: 100%;
`;

export const PageButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const PageButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 15px;

  &:hover {
    color: rgb(103, 27, 125);
  }
`;

/** Styles for print tickets */
export const PrintContainer = styled.div`
  width: 210mm;
  display: grid;
  grid-template-columns: repeat(2, 0fr);
  gap: 0mm 13mm;
  box-sizing: border-box;

  @media print {
    page-break-inside: avoid;
    margin: 0;
  }
`;

export const PrintLabel = styled.div`
  width: 101.6mm;
  height: 29.4mm;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  border: 1px solid #000;
  box-sizing: border-box;
  text-align: center;
  padding: 5mm;

  @media print {
    page-break-inside: avoid;
  }
`;

export const PrintUserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const PrintUserName = styled.div`
  font-size: 9pt;
  font-weight: bold;
  text-align: left;
  text-transform: uppercase;
`;

export const PrintBirthday = styled.div`
  font-size: 9pt;
  text-align: right;
`;

export const PrintAddressLine = styled.div`
  font-size: 8pt;
`;

export const PrintCityState = styled.div`
  font-size: 8pt;
`;

export const PrintPostalCode = styled.div`
  font-size: 8pt;
`;
