import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getToken, formatDate } from "../../utils/utils";
import * as C from "./styles";

const Print = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get("ids");

    if (!ids) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${apiUrl}users-ticket/${ids}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {}
    };

    fetchUsers();
  }, [location.search]);

  const chunkUsers = (users, size) => {
    const result = [];
    for (let i = 0; i < users.length; i += size) {
      result.push(users.slice(i, i + size));
    }
    return result;
  };

  const usersChunks = chunkUsers(users, 20);

  return (
    <>
      {usersChunks.map((chunk, index) => (
        <C.Container key={`container-${index}`}>
          {chunk.map((user, userIndex) => (
            <C.Label key={user.id}>
              <C.UserInfo>
                <C.UserName>{user.name.toUpperCase()}</C.UserName>
                <C.Birthday>{formatDate(user.birth_date)}</C.Birthday>
              </C.UserInfo>
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
          {chunk.length < 20 &&
            Array.from({ length: 20 - chunk.length }).map((_, emptyIndex) => (
              <C.Label
                key={`empty-${emptyIndex}`}
                style={{ visibility: "hidden" }}
              />
            ))}
        </C.Container>
      ))}
    </>
  );
};

export default Print;
