import { useDispatch } from "react-redux";
import { save } from "../authStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, TextField , Grid, Paper, Link, Alert} from '@mui/material';
import logo from './../../fiuber-logo.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [errorStyle, setErrorStyle] = useState('none');
  const [errorMessage, setErrorMessage] = useState(" ");
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (error) {
      alert(error)
    }
    if (user){       
      const fetchUserData = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();        
            dispatch(save(data));
            navigate("/profile")            
        } catch (err) {
            console.error(err);
            alert("Error obteniendo los datos de usuario");
          }
      };
      fetchUserData();
    } 
  }, [user, loading, navigate, error, dispatch]);  

  return (    
    <Grid 
      display="flex"
      style={{height:'100vh',width: '100vw', alignItems:'center'}}
    >      
      <Paper 
        elevation={10} 
        style={{padding :20,width:300, margin:"20px auto"}}
      >              
      <img src={logo} className="App-logo" alt="logo" />
        <Alert severity="error" sx={{ display: errorStyle}} >Invalid username or password. <strong>{errorMessage}</strong></Alert>
        <TextField 
          label="E-mail" 
          variant="outlined" 
          value={email}
          style={{ margin:10}}
          onChange={(e) => setEmail(e.target.value)}
          />
        <TextField 
          label="Password" 
          variant="outlined"
          type="password" 
          value={password}
          style={{ margin:10}}
          onChange={(e) => setPassword(e.target.value)}
          />
        <Button
          variant="contained"
          style={{ margin:10}}
          onClick={() => logInWithEmailAndPassword(email, password, (content) => {
            setPassword("");
            setErrorStyle('flexbox');
            setErrorMessage(content); 
          })}
          >
          Sign in
        </Button>        
        <br></br>
        <Link href="/reset">Forgot my password</Link>        
      </Paper>
    </Grid>

  );
}

export default Login;