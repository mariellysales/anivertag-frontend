import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getToken } from "../../utils/utils";
import * as C from "./styles";

const Print = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get("ids");

    if (!ids) {
      console.error("Nenhum ID fornecido.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users-ticket/${ids}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro:", errorData.message);
          return;
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error.message);
      }
    };

    fetchUsers();
  }, [location.search]);

  return (
    <C.Container>
      {users.map((user) => (
        <C.Label key={user.id}>
          <C.UserName>{user.name.toUpperCase()}</C.UserName>
          <C.AddressLine>
            {user.address.street}, {user.address.number}
            {user.address.additional_information
              ? ` - ${user.address.additional_information}`
              : ""}
          </C.AddressLine>
          <C.AddressLine>{user.address.neighborhood}</C.AddressLine>
          <C.CityState>
            {user.address.city}/{user.address.state}
          </C.CityState>
          <C.PostalCode>{user.address.postal_code}</C.PostalCode>
        </C.Label>
      ))}
    </C.Container>
  );
};

export default Print;
