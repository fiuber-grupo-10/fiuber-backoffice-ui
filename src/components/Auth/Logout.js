import { logout } from "../../firebase";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Paper, Alert } from '@mui/material';


function Logout() {
  const navigate = useNavigate();
  logout();

  return (
    <Grid
      display="flex"
      style={{ height: '100vh', width: '100vw', alignItems: 'center' }}
    >
      <Paper
        elevation={10}
        style={{ padding: 20, width: 300, margin: "20px auto" }}
      >
        <Alert severity="info" sx={{ display: 'flexbox' }} >See you later!</Alert>
      <Button
          variant="contained"
          style={{ margin:10}}
          onClick={() => navigate("/fiuber-backoffice-ui/")}
          >
          home
        </Button> 
      </Paper>
    </Grid>

  );
}

export default Logout;