import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer, Table, Th, Td, Button, GroupButton } from "./style";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/utils";

const UserTable = ({ users, onDelete, onSelect, selectAll, onSelectAll }) => {
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </Th>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th>Cidade</Th>
            <Th>Aniversário</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Td>
                <input
                  type="checkbox"
                  checked={user.isSelected || false}
                  onChange={(e) => onSelect(user.id, e.target.checked)}
                />
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.cpf}</Td>
              <Td>{user.address?.city}</Td>
              <Td>{formatDate(user.birth_date)}</Td>
              <Td>
                <GroupButton>
                  <Button onClick={() => navigate(`/edit/${user.id}`)}>
                    <FaEdit />
                  </Button>
                  <Button onClick={() => onDelete(user.id)}>
                    <FaTrash />
                  </Button>
                </GroupButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
