import React, { useCallback, useState, useEffect } from "react";
import MaskedInput from "react-maskedinput";
import { findDOMNode } from "react-dom";
import ReactDOM from "react-dom/client";

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    cpf: "",
    neighborhood: "",
    start_date: "",
    end_date: "",
  });

  const fetchData = useCallback(async () => {
    const token = "lHONlaWxhAX1Am1SL21xoRcGJbmqma8a217VDBIod7914d4d";
    let url = `http://127.0.0.1:8000/api/users-addresses-filter?page=${page}`;

    const queryParams = new URLSearchParams({
      name: filters.name,
      cpf: filters.cpf,
      neighborhood: filters.neighborhood,
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
        setUsers(data.users.data);
        setTotalPages(data.users.last_page || 1);
      } else {
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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <MaskedInput
          mask="111.111.111-11" // Máscara do CPF
          name="cpf"
          value={filters.cpf}
          onChange={handleFilterChange}
          placeholder="CPF"
        />
        <input
          type="text"
          name="neighborhood"
          placeholder="Bairro"
          value={filters.neighborhood}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <div className="grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <p>{user.name}</p>
              <p>{user.cpf}</p>
              <p>{user.email}</p>
              <p>{user.birth_date}</p>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={page === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserList;
