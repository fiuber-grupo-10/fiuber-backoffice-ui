import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, TextField , Grid, Paper, Link, Typography} from '@mui/material';
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (error) { 
      alert(error)
    }
    if (user) navigate("/profile");
  }, [user, loading, navigate, error]);

  return (
    <Grid 
      display="flex"
      style={{height:'100vh',width: '100vw', alignItems:'center'}}
    >
      <Paper 
        elevation={10} 
        style={{padding :20,height:'35vh',width:280, margin:"20px auto"}}
      >
        <TextField 
          label="Correo electrónico" 
          variant="outlined" 
          value={email}
          style={{ margin:10}}
          onChange={(e) => setEmail(e.target.value)}
          />
        <TextField 
          label="Contraseña" 
          variant="outlined"
          type="password" 
          value={password}
          style={{ margin:10}}
          onChange={(e) => setPassword(e.target.value)}
          />
        <Button
          variant="contained"
          style={{ margin:10}}
          onClick={() => logInWithEmailAndPassword(email, password)}
          >
          Iniciar sesión
        </Button>
        <Button
          variant="text"
          style={{ margin:10}}
          onClick={signInWithGoogle}
          >
          Iniciar sesión con Google
        </Button>
        <Link href="/reset">Olvidé mi contraseña</Link>
        <Typography variant='subtitle2' style={{ marginTop:10}}>
          No tiene una cuenta? 
        </Typography>
        <Typography variant='subtitle2'>
          <Link href="/register"> Regístrese </Link>
          ahora.
        </Typography>
      </Paper>
    </Grid>

  );
}

export default Login;