import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../firebase";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (error) { 
      alert(error)
    }
    if (user) navigate("/dashboard");
  }, [user, loading, navigate, error]);

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <button className="reset__btn" onClick={() =>{
          sendPasswordReset(email);
          navigate('/');
          } 
        }>
          Enviar mail para reestablecer contraseña
        </button>

        <div>
          No tiene una cuenta? <Link to="/register">Regístrese</Link> ahora.
        </div>
      </div>
    </div>
  );
}

export default Reset;