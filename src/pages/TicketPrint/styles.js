import styled from "styled-components";

export const Container = styled.div`
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

export const Label = styled.div`
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

export const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const UserName = styled.div`
  font-size: 9pt;
  font-weight: bold;
  text-align: left;
  text-transform: uppercase;
`;

export const Birthday = styled.div`
  font-size: 9pt;
  text-align: right;
`;

export const AddressLine = styled.div`
  font-size: 8pt;
`;

export const CityState = styled.div`
  font-size: 8pt;
`;

export const PostalCode = styled.div`
  font-size: 8pt;
`;
