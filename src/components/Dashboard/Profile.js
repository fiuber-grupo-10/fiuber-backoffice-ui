import { getUser } from "../authStore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Grid, Paper, Typography} from '@mui/material';
import Navbar from "./Navbar";

function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  var currentUser = getUser()  
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/fiuber-backoffice-ui/");
    if (!currentUser) return navigate("/fiuber-backoffice-ui/");
    if (!currentUser.roles.includes("admin")){
      return navigate("/fiuber-backoffice-ui/unauthorized");
    }
    if (error) { 
      alert(error)
    }       
    
    setName(currentUser.name);
  }, [setName, currentUser, navigate, error,loading,user]);

  return (
    <Grid
      style={{height:'100vh',width: '100vw', alignItems:'center'}}
    >
      <Navbar/>
      <Grid 
        display="flex"
        style={{height:'94vh',width: '100vw', alignItems:'center'}}
      >
        <Paper 
          elevation={10} 
          style={{padding :20,height:'90%',width:'90%', margin:"20px auto"}}
        >
          <h1>Welcome to the FIUBER's admin page, {name}</h1>
          <Typography>
              {name}
          </Typography>
          <Typography>
              {user?.email}
          </Typography>
          
        </Paper>
      </Grid>
    </Grid>
    
  );
}

export default Profile;