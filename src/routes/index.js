import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EditUser from "../pages/Edit";
import Print from "../pages/TicketPrint";

const Private = ({ Item }) => {
  const { signed } = useAuth();

  return signed ? <Item /> : <Login />;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route exact path="/home" element={<Private Item={Home} />} />
          <Route path="/edit/:id" element={<Private Item={EditUser} />} />
          <Route path="/print" element={<Private Item={Print} />} />
          <Route path="/signin" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
