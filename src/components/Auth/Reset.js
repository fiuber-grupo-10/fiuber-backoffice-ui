import { Button, TextField , Grid, Paper} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordReset } from "../../firebase";


function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (error) { 
      alert(error)
    }
    if (user) navigate("/fiuber-backoffice-ui/dashboard");
  }, [user, loading, navigate, error]);

  return (
    <Grid 
    display="flex"
    style={{height:'100vh',width: '100vw', alignItems:'center'}}>
    <Paper 
      elevation={10} 
      style={{padding :20,height:'14vh',width:280, margin:"20px auto"}}
    >
       <TextField
           label="E-mail" 
           variant="outlined" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <br></br>
        <Button
          variant="contained"
          style={{ margin:10}}
          onClick={() =>{sendPasswordReset(email); navigate('/fiuber-backoffice-ui/');} 
        }>
          Reset password
        </Button> 
      </Paper>
      </Grid>
  );
}

export default Reset;