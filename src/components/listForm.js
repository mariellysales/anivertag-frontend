import React, { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    cpf: "",
    neighborhood: "",
    date: "",
    start_date: "",
    end_date: "",
  });

  const fetchData = async () => {
    const token = "lHONlaWxhAX1Am1SL21xoRcGJbmqma8a217VDBIod7914d4d";
    let url = `http://127.0.0.1:8000/api/users-addresses-filter?page=${page}`;

    const queryParams = new URLSearchParams(filters);
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
        console.log("leo", data);
        setUsers(data.users.data);
      } else {
        console.error("Erro ao buscar dados");
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

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
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={filters.cpf}
          onChange={handleFilterChange}
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
          name="date"
          value={filters.date}
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
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === 24}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserList;
