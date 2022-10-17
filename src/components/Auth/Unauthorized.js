import { logout } from "../../firebase";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Paper, Alert} from '@mui/material';


function Unauthorized() {  
  const navigate = useNavigate();    
  
  return (    
    <Grid 
      display="flex"
      style={{height:'100vh',width: '100vw', alignItems:'center'}}
    >
      <Paper 
        elevation={10} 
        style={{padding :20,width:300, margin:"20px auto"}}
      >              
        <Alert severity="error" sx={{ display: 'flexbox'}} >You're unauthorized. <br></br>Please contact your admin.</Alert>                
        <Button
          variant="contained"
          style={{ margin:10}}
          onClick={() => {logout(); navigate("/")}}
          >
          log out
        </Button> 
      </Paper>
    </Grid>

  );
}

export default Unauthorized;