import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 101.6mm);
  grid-auto-rows: 25.4mm;
  width: 210mm;
  height: 297mm;
  margin: auto;
  box-sizing: border-box;

  @media print {
    page-break-after: always;
  }
`;

export const Label = styled.div`
  width: 101.6mm;
  height: 25.4mm;
  padding: 4mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;

  font-family: Arial, sans-serif;
  font-size: 10pt;
  line-height: 1.2;

  border: 1px dashed #000;

  @media print {
    border: none;
  }
`;

export const UserName = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 1mm;
`;

export const AddressLine = styled.div`
  margin: 0;
`;

export const CityState = styled.div`
  margin: 0;
`;

export const PostalCode = styled.div`
  margin: 0;
`;
