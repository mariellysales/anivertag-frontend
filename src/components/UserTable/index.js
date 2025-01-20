import React from "react";
import { FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import { TableContainer, Table, Th, Td, Button, GroupButton } from "./style";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  if (!date) return "";
  const newDate = new Date(date);
  const day = String(newDate.getDate() + 1).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

const UserTable = ({
  users,
  onDelete,
  onPrint,
  onSelect,
  selectAll,
  onSelectAll,
  tableRef,
}) => {
  const navigate = useNavigate();
  return (
    <TableContainer>
      <Table ref={tableRef}>
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
                  <Button onClick={() => onPrint(user.id)}>
                    <FaPrint />
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
