import React, { useState, useRef } from "react";
import * as C from "./styles";
import RegisterInput from "../../components/RegisterInput";
import LoginButton from "../../components/LoginButton";
import { maskCPF } from "../../utils/utils";
import Header from "../../components/Header";

const Register = () => {
  const successMessageRef = useRef(null);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [main_phone, setMainPhone] = useState("");
  const [reference_contact_name, setReferenceContactName] = useState("");
  const [reference_contact, setReferenceContact] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [additional_information, setAdditionalInformation] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const REQUIRED_FIELDS = {
    name: "Nome",
    cpf: "CPF",
    birth_date: "Data de nascimento",
    main_phone: "Telefone principal",
    reference_contact_name: "Nome do contato de referência",
    reference_contact: "Telefone do Contato de Referência",
    street: "Rua",
    neighborhood: "Bairro",
    city: "Cidade",
    postal_code: "CEP",
  };

  const formatDate = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return numbers.replace(/(\d{2})(\d{2})/, "$1/$2");
    } else if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/$3");
    } else {
      return numbers.replace(/(\d{2})(\d{2})(\d{2})(\d{4})/, "$1/$2/$3$4");
    }
  };

  const convertDateToDBFormat = (value) => {
    const [day, month, year] = value.split("/");
    return `${year}-${month}-${day}`;
  };

  const maskPhone = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const maskPostalCode = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const isPostalCodeFromGoias = (postal_code) => {
    const numericPostalCode = postal_code.replace(/\D/g, "");
    const postalCodeNumber = parseInt(numericPostalCode, 10);

    // Verifica se o CEP está entre 74000000 e 77999999 (faixa completa de GO)
    if (postalCodeNumber < 74000000 || postalCodeNumber > 77999999) {
      return false;
    }

    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (
      !name &&
      !cpf &&
      !birth_date &&
      !main_phone &&
      !reference_contact_name &&
      !reference_contact &&
      !neighborhood &&
      !city &&
      !postal_code
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!number && !additional_information) {
      setError(
        "Por favor, preencha pelo menos um dos campos: 'Número' ou 'Informações Adicionais'."
      );
      return;
    }

    for (const [field, label] of Object.entries(REQUIRED_FIELDS)) {
      if (!eval(field)) {
        setError(`O campo '${label}' é obrigatório`);
        return;
      }
    }

    if (email && !validateEmail(email)) {
      setError("O e-mail não é válido.");
      return;
    }

    if (!isPostalCodeFromGoias(postal_code)) {
      setError("O CEP informado não pertence ao estado de Goiás.");
      return;
    }

    setLoading(true);

    const resetForm = () => {
      setName("");
      setCpf("");
      setEmail("");
      setBirthDate("");
      setMainPhone("");
      setReferenceContactName("");
      setReferenceContact("");
      setStreet("");
      setNumber("");
      setAdditionalInformation("");
      setNeighborhood("");
      setCity("");
      setPostalCode("");
      setError("");
    };

    try {
      const formattedDate = convertDateToDBFormat(birth_date);
      const formattedMainPhone = maskPhone(main_phone);
      const formattedReferencePhone = maskPhone(reference_contact);
      const formattedPostalCode = maskPostalCode(postal_code);
      const formattedCpf = maskCPF(cpf);

      const response = await fetch("http://127.0.0.1:8000/api/full-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          cpf: formattedCpf,
          email,
          birth_date: formattedDate,
          main_phone: formattedMainPhone,
          reference_contact_name,
          reference_contact: formattedReferencePhone,
          is_active: true,
          postal_code: formattedPostalCode,
          street,
          number: number || null,
          additional_information: additional_information || null,
          neighborhood,
          city,
          state: "GO",
          country: "Brasil",
        }),
      });

      const data = await response.json();

      if (data.status === "duplicate") {
        setError("Usuário já está cadastrado.");
      } else if (data.status === "invalid") {
        setError("CPF inválido.");
      } else if (data.status === true) {
        resetForm();
        setSuccessMessage("Cadastro realizado com sucesso!");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setError("Erro ao tentar cadastrar");
      }
    } catch (error) {
      setError("Erro ao tentar cadastrar");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <C.Container>
      <Header></Header>
      <C.Body>
        <C.TitleRegisterLabel>
          PREPARAMOS ALGO INCRÍVEL PARA O SEU ANIVERSÁRIO – CADASTRE-SE!
        </C.TitleRegisterLabel>
        <C.Content>
          {successMessage && (
            <div
              ref={successMessageRef}
              style={{ color: "green", marginTop: "20px" }}
            >
              {successMessage}
            </div>
          )}
          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="name">
              Nome:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={name}
              onChange={(e) => [setName(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="cpf">CPF:</C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={cpf}
              onChange={(e) => {
                const formattedCPF = maskCPF(e.target.value);
                setCpf(formattedCPF);
                setError("");
              }}
              maxLength="14"
              required
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="email">
              E-mail:
            </C.RegisterContentLabel>
            <RegisterInput
              type="email"
              value={email}
              onChange={(e) => [setEmail(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="birth_date">
              Data de Nascimento:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={birth_date}
              onChange={(e) => {
                const formattedDate = formatDate(e.target.value);
                setBirthDate(formattedDate);
                setError("");
              }}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="main_phone">
              Telefone Principal:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={main_phone}
              onChange={(e) => {
                const formattedPhone = maskPhone(e.target.value);
                setMainPhone(formattedPhone);
                setError("");
              }}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="reference_contact_name">
              Nome do Contato de Referência:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={reference_contact_name}
              onChange={(e) => [
                setReferenceContactName(e.target.value),
                setError(""),
              ]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="reference_contact">
              Telefone do Contato de Referência:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={reference_contact}
              onChange={(e) => {
                const formattedPhone = maskPhone(e.target.value);
                setReferenceContact(formattedPhone);
                setError("");
              }}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="street">
              Rua:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={street}
              onChange={(e) => [setStreet(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="number">
              Número:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={number}
              onChange={(e) => [setNumber(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="additional_information">
              Informações Adicionais:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={additional_information}
              onChange={(e) => [
                setAdditionalInformation(e.target.value),
                setError(""),
              ]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="neighborhood">
              Bairro:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={neighborhood}
              onChange={(e) => [setNeighborhood(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="postal_code">
              CEP:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={postal_code}
              onChange={(e) => {
                const formattedCEP = maskPostalCode(e.target.value);
                setPostalCode(formattedCEP);
                setError("");
              }}
              maxLength="9"
            />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="state">
              Estado:
            </C.RegisterContentLabel>
            <RegisterInput type="text" value="Goiás" readOnly disabled />
          </C.RegisterInputGroup>

          <C.RegisterInputGroup>
            <C.RegisterContentLabel htmlFor="city">
              Cidade:
            </C.RegisterContentLabel>
            <RegisterInput
              type="text"
              value={city}
              onChange={(e) => [setCity(e.target.value), setError("")]}
            />
          </C.RegisterInputGroup>

          <C.LabelError>{error}</C.LabelError>
          <LoginButton
            Text={loading ? "Cadastrando..." : "Cadastrar"}
            onClick={handleRegister}
            disabled={loading}
          />
        </C.Content>
      </C.Body>
    </C.Container>
  );
};

export default Register;
