import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import luckyCat from "@assets/LuckyCat.png";
import "@styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  // Función que maneja el envío del formulario de inicio de sesión
const loginSubmit = async (data) => {
  try {
    const response = await loginService(data);
    const { accessToken } = response.data;
    if (response.request.status === 200 && accessToken) {
      localStorage.setItem("token", accessToken); 
      // Decodificar el token para obtener el usuario y rol real
      const { username, email, rut, role, rol } = jwtDecode(accessToken);
      const userRole = role || rol;
      localStorage.setItem("user", JSON.stringify({ username, email, rut, role: userRole }));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/home");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error(error);
    setLoginError("Error al iniciar sesión");
  }
};

  return (
    <main className="page-root">
      <div className="lucky-cat-container">
        <img src={luckyCat} alt="Lucky Cat" className="lucky-cat" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm mode="login" onSubmit={loginSubmit} loginError={loginError} />
      </div>
    </main>
  );
};

export default Login;