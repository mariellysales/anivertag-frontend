import React from "react";
import { FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import {
  TableContainer,
  Table,
  Th,
  Td,
  Button,
  /**
  TrHover,
  Button */
} from "./style";

const UserTable = ({ users, onEdit, onDelete, onPrint, onSelect }) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th></Th>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th>Email</Th>
            <Th>Cidade</Th>
            <Th>Data de Nascimento</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td>
                <input
                  type="checkbox"
                  onChange={(e) => onSelect(user.id, e.target.checked)}
                />
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.cpf}</Td>
              <Td>{user.email}</Td>
              <Td>{user.address?.city}</Td>
              <Td>{user.birth_date}</Td>
              <Td>
                <Button onClick={() => onEdit(user.id)}>
                  <FaEdit />
                </Button>
                <Button onClick={() => onDelete(user.id)}>
                  <FaTrash />
                </Button>
                <Button onClick={() => onPrint(user.id)}>
                  <FaPrint />
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
