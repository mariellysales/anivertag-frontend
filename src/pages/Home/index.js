import React, { useCallback, useState, useEffect, useRef } from "react";
import * as C from "./styles";
import HomeInput from "../../components/HomeInput";
import UserTable from "../../components/UserTable";
import { maskCPF, getToken, decryptData, formatDate } from "../../utils/utils";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function Home() {
  const [users, setUsers] = useState([]);
  const [usersToPrint, setUsersToPrint] = useState([]);
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
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);

  const handleLogout = () => {
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

  const handlePrint = async () => {
    setIsPrinting(true);
    const selectedUsers = users.filter((user) => user.isSelected);
    const ids = selectedUsers.map((user) => user.id);
  
    if (ids.length === 0) {
      return;
    }

    /** Print tickets with redirect */
    // navigate(`/print?ids=${ids.join(",")}`);
  
    /** Print tickets without redirect */
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
        setIsPrinting(false);
        return;
      }
  
      const data = await response.json();
      
      setUsersToPrint(data.users);    
    } catch (error) {
      console.error("Erro ao buscar usuários para impressão:", error);
      setIsPrinting(false);
    }
  };

  const print = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Impressao",
    onAfterPrint: () => {
      console.log("Impressão/PDF concluído!");
      setUsersToPrint([]);
    },
  });

  useEffect(() => {
    if (usersToPrint.length > 0) {
      print();
      setUsersToPrint([]);
      setIsPrinting(false);
    }
  }, [print, usersToPrint]);



  const chunkUsers = (usersToPrint, size) => {
    const result = [];
    for (let i = 0; i < usersToPrint.length; i += size) {
      result.push(usersToPrint.slice(i, i + size));
    }
    return result;
  };

  const getPageMargins = () => {
    return `@page { margin: 10mm 10mm 10mm 10mm !important; }`;
  };

  const usersChunks = chunkUsers(usersToPrint, 20);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/deactivate/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {}
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
          return;
        }

        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => !selectedUsers.some((selected) => selected.id === user.id)
          )
        );
      }
      setSelectAll(false);
    } catch (error) {}
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
        }
        setSelectAll(false);
      } catch (error) {}
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
          <C.Button 
          onClick={handlePrint}  
          disabled={isPrinting}
          >{isPrinting ? 'Imprimindo...' : 'Imprimir Selecionados'}</C.Button>
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
      <div ref={printRef}>
      <style>{getPageMargins()}</style>
        {usersChunks.map((chunk, index) => (
                <C.PrintContainer key={`container-${index}`}>
                  {chunk.map((user, userIndex) => (
                    <C.PrintLabel key={user.id}>
                      <C.PrintUserInfo>
                        <C.PrintUserName>{user.name.toUpperCase()}</C.PrintUserName>
                        <C.PrintBirthday>{formatDate(user.birth_date)}</C.PrintBirthday>
                      </C.PrintUserInfo>
                      <C.PrintAddressLine>
                        {user.address.street}, {user.address.number}
                        {user.address.additional_information
                          ? ` - ${user.address.additional_information}`
                          : ""}
                      </C.PrintAddressLine>
                      <C.PrintAddressLine>{user.address.neighborhood}</C.PrintAddressLine>
                      <C.PrintCityState>
                        {user.address.city}/{user.address.state}
                      </C.PrintCityState>
                      <C.PrintPostalCode>{user.address.postal_code}</C.PrintPostalCode>
                    </C.PrintLabel>
                  ))}
                  {chunk.length < 20 &&
                    Array.from({ length: 20 - chunk.length }).map((_, emptyIndex) => (
                      <C.PrintLabel
                        key={`empty-${emptyIndex}`}
                        style={{ visibility: "hidden" }}
                      />
                    ))}
                </C.PrintContainer>
              ))}
      </div>
    </C.Content>
  );
}

export default Home;
