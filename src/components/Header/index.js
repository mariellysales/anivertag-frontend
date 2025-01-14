import React from "react";
import * as C from "./styles";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/home";
  const isEditPage = location.pathname.startsWith("/edit/");

  const handleLogout = () => {
    onLogout();
    navigate("/home");
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <C.Header>
      <C.Logo>
        <C.Img src="/../images/logo.png" alt="Logo" />
      </C.Logo>
      {isHomePage && (
        <C.LogoutButton onClick={handleLogout}>Sair</C.LogoutButton>
      )}
      {isEditPage && (
        <C.LogoutButton onClick={handleBackHome}>Voltar</C.LogoutButton>
      )}
    </C.Header>
  );
};

export default Header;
