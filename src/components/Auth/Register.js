import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = () => {
    if (!name) alert("Ingrese un nombre de usuario");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;    
    if (error) { 
      alert(error)
    }
  }, [user, loading, navigate, error]);

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button className="register__btn" onClick={register}>
          Registrarse
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}
        >
          Registrarse con Google
        </button>

        <div>
          Ya tiene una cuenta? <Link to="/">Inicie sesión</Link>.
        </div>
      </div>
    </div>
  );
}

export default Register;