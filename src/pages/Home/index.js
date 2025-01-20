import React, { useCallback, useState, useEffect, useRef } from "react";
import * as C from "./styles";
import HomeInput from "../../components/HomeInput";
import UserTable from "../../components/UserTable";
import { maskCPF, getToken, decryptData } from "../../utils/utils";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
//import { useReactToPrint } from "react-to-print";

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

  const handleLogout = () => {
    console.log("Usuário deslogado.");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
  };

  const handlePrint = () => {
    navigate("/print");
    /**
    content: () => tableRef.current,
    documentTitle: "Tabela de Usuários",
    onAfterPrint: () => console.log("Impressão concluída!"),
     */
  };

  const handleDelete = async (userId) => {
    const selectedUsers = users.filter((user) => user.isSelected);

    try {
      const ids = selectedUsers.map((user) => user.id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/users/deactivate/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: ids }),
        }
      );
      console.log(userId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro:", errorData.message);
        return;
      }

      const data = await response.json();
      console.log(data.message);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !ids.includes(user.id))
      );
    } catch (error) {
      console.error("Erro na conexão com a API.");
    }
  };

  const handleDeleteSelected = async () => {
    const selectedUsers = users.filter((user) => user.isSelected);

    if (selectedUsers.length === 0) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const decryptedToken = decryptData(token);
      const userToken = decryptedToken.token;

      for (let user of selectedUsers) {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${user.id}/deactivate/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${userToken}`,
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
        console.log(data.message);

        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => !selectedUsers.some((selected) => selected.id === user.id)
          )
        );
      }
      setSelectAll(false);
    } catch (error) {
      console.error("Erro ao tentar excluir os usuários:", error);
    }
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

  const proceedToRequest = (activeFilters, filters) => {
    let lastFilter = localStorage.getItem("lastFilter");

    if (
      (filters.start_date && filters.start_date.length !== 5) ||
      (filters.end_date && filters.end_date.length !== 5)
    ) {
      return false;
    }

    if (!lastFilter) {
      localStorage.setItem("lastFilter", JSON.stringify(activeFilters));
      return true;
    }

    if (
      lastFilter &&
      JSON.stringify(lastFilter) !== JSON.stringify(activeFilters) &&
      Object.keys(activeFilters).length > 0
    ) {
      localStorage.setItem("lastFilter", JSON.stringify(activeFilters));
      return true;
    }

    return false;
  };

  const fetchData = useCallback(async () => {
    let token = localStorage.getItem("authToken");
    token = decryptData(token);
    token = token.token;
    if (!token) {
      console.error("Token não encontrado. Redirecionando para login...");
      window.location.href = "/login";
      return;
    }

    let url = `http://127.0.0.1:8000/api/users-addresses-filter?page=${page}`;

    const activeFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (
          (key === "name" && value && value.length >= 1) ||
          (key === "cpf" && value && value.length >= 3) ||
          (key === "city" && value && value.length >= 1) ||
          (key === "start_date" && value && value.length >= 5) ||
          (key === "end_date" && value && value.length >= 5)
        ) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const queryParams = new URLSearchParams(activeFilters);

    if (proceedToRequest(activeFilters, filters)) {
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
          const filteredUsers = data.users.data.filter(
            (user) => user.is_active === 1
          );

          setUsers(
            filteredUsers.map((user) => ({
              ...user,
              isSelected: false,
            }))
          );
          setTotalPages(data.users.last_page || 1);
        } else {
          setUsers([]);
          console.error("Erro ao buscar dados");
        }
        setSelectAll(false);
      } catch (error) {
        console.error("Erro ao fazer requisição:", error);
      }
    }
  }, [filters, page]);

  useEffect(() => {
    localStorage.removeItem("lastFilter");
    fetchData();
  }, [page, filters, fetchData]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (!value) {
      localStorage.removeItem("lastFilter");
    }

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

    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <C.Content>
      <Header onLogout={handleLogout} onBackHome={handleBackHome} />
      <C.Body>
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

        <C.Buttons>
          <C.Button onClick={handlePrint}>Imprimir Selecionados</C.Button>
          <C.Button onClick={handleDeleteSelected}>
            Deletar Selecionados
          </C.Button>
        </C.Buttons>

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
            Anterior
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
            Próximo
          </C.PageButton>
        </C.PageButtonGroup>
      </C.Body>
    </C.Content>
  );
}

export default Home;
