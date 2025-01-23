import styled from "styled-components";

export const Container = styled.div`
  width: 210mm;
  height: 297mm;
  display: grid;
  grid-template-columns: repeat(2, 0fr);
  gap: 0mm 2mm;
  padding: 5mm;
  box-sizing: border-box;

  @media print {
    page-break-after: always;
  }
`;

export const Label = styled.div`
  width: 101.6mm;
  height: 29.6mm;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #000;
  box-sizing: border-box;
  text-align: center;
  padding: 2mm;
`;

export const UserName = styled.div`
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
`;

export const AddressLine = styled.div`
  font-size: 10pt;
`;

export const CityState = styled.div`
  font-size: 10pt;
`;

export const PostalCode = styled.div`
  font-size: 10pt;
`;
