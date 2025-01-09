import React, { useCallback, useState, useEffect } from "react";
//import useAuth from "../../hooks/useAuth";
//import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import HomeInput from "../../components/HomeInput";
import UserTable from "../../components/UserTable";

function Home() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    cpf: "",
    city: "",
    start_date: "",
    end_date: "",
  });

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        isSelected: isSelected,
      }))
    );
  };

  const handleSelect = (userId, isSelected) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isSelected } : user
      )
    );

    const allSelected = users.every((user) =>
      user.id === userId ? isSelected : user.isSelected
    );
    setSelectAll(allSelected);
  };

  //const navigate = useNavigate();

  // const { signout } = useAuth();

  const maskCPF = (value) => {
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, "");

    // Aplica a formatação progressivamente conforme o número de caracteres digitados
    if (cleanValue.length <= 3) {
      return cleanValue; // Exibe apenas os 3 primeiros números
    }
    if (cleanValue.length <= 6) {
      return cleanValue.replace(/(\d{3})(\d{0,3})/, "$1.$2"); // Exibe os 3 primeiros números seguidos por ponto
    }
    if (cleanValue.length <= 9) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3"); // Exibe os 3 primeiros números seguidos por 2 pontos
    }
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4"); // Exibe o CPF completo
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    newValue = newValue.replace(/[^0-9/]/g, "");

    if (newValue.length > 2 && newValue[2] !== "/") {
      newValue = newValue.substring(0, 2) + "/" + newValue.substring(2);
    }

    if (newValue.length > 5) {
      newValue = newValue.substring(0, 5);
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }));
  };

  const fetchData = useCallback(async () => {
    const token = "lHONlaWxhAX1Am1SL21xoRcGJbmqma8a217VDBIod7914d4d";
    let url = `http://127.0.0.1:8000/api/users-addresses-filter?page=${page}`;

    const queryParams = new URLSearchParams({
      name: filters.name,
      cpf: filters.cpf,
      city: filters.city,
      start_date: filters.start_date,
      end_date: filters.end_date,
    });

    if (queryParams.toString()) {
      url += `&${queryParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status) {
        setUsers(
          data.users.data.map((user) => ({
            ...user,
            isSelected: false,
          }))
        );
        setTotalPages(data.users.last_page || 1);
      } else {
        setUsers([]);
        console.error("Erro ao buscar dados");
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchData();
  }, [page, filters, fetchData]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    // Aplica a máscara no CPF
    if (name === "cpf") {
      const formattedValue = maskCPF(value);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: formattedValue,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }

    setPage(1); // Reseta para a primeira página sempre que houver alteração no filtro
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  /*const handleLogout = () => {
    signout();
    navigate("/signin");
  };*/

  return (
    <C.Content>
      <C.TitleHomeLabel>CONSULTA DE ANIVERSARIANTES</C.TitleHomeLabel>
      <C.HomeInputGroup>
        <HomeInput
          type="text"
          name="name"
          placeholder="Nome"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <HomeInput
          type="text"
          name="cpf"
          value={filters.cpf}
          onChange={handleFilterChange}
          placeholder="CPF"
        />
        <HomeInput
          type="text"
          name="city"
          placeholder="Cidade"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <HomeInput
          type="text"
          name="start_date"
          value={filters.start_date}
          onChange={handleDateChange}
          placeholder="Dia/Mês inicial"
          maxLength="5"
        />
        <HomeInput
          type="text"
          name="end_date"
          value={filters.end_date}
          onChange={handleDateChange}
          placeholder="Dia/Mês final"
          maxLength="5"
        />
      </C.HomeInputGroup>

      <C.Grid>
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          selectAll={selectAll}
        />
      </C.Grid>
      <C.PageButtonGroup>
        <C.PageButton
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </C.PageButton>
        {Array.from({ length: totalPages }, (_, index) => (
          <C.PageButton
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={page === index + 1 ? "active" : ""}
          >
            {index + 1}
          </C.PageButton>
        ))}
        <C.PageButton
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </C.PageButton>
      </C.PageButtonGroup>
    </C.Content>
  );
}

export default Home;
