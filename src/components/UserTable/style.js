import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 500px) {
    font-size: 12px;
  }
`;

export const Th = styled.th`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  color: #333;
  font-weight: bold;

  @media (max-width: 610px) {
    font-size: 15px;
  }

  @media (max-width: 590px) {
    font-size: 12px;
    padding: 15px;
  }

  @media (max-width: 500px) {
    padding: 6px;
    padding: 10px;
  }

  @media (max-width: 475px) {
    font-size: 10px;
  }
`;

export const Td = styled.td`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;

  @media (max-width: 590px) {
    padding: 8px;
    font-size: 12px;
  }

  @media (max-width: 500px) {
    padding: 6px;
  }

  @media (max-width: 475px) {
    padding: 0px;
    font-size: 10px;
  }
`;

export const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  color: rgb(130, 74, 220);
  font-size: 20px;
  &:hover {
    color: rgb(102, 59, 173);
  }

  @media (max-width: 775px) {
    display: block;
  }

  @media (max-width: 590px) {
    font-size: 15px;
  }

  @media (max-width: 500px) {
    padding: 6px;
  }
`;