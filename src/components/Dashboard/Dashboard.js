import { Provider } from 'react-redux'
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Grid, Paper, Typography } from '@mui/material';
import Navbar from "./Navbar";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("Error obteniendo los datos de usuario");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (error) {
      alert(error)
    }
    fetchUserName();
  });
  return (
    <Provider>
    <Grid style={{ height: '100vh', width: '100vw', alignItems: 'center' }}>
      <Navbar />
      <Grid
        display="flex"
        style={{ height: '94vh', width: '100vw', alignItems: 'center' }}
      >
        <Paper
          elevation={10}
          style={{ padding: 20, height: '90%', width: '90%', margin: "20px auto" }}
        >
          <Typography>
            {name}
          </Typography>
          <Typography>
            {user?.email}
          </Typography>
        </Paper>
      </Grid>

    </Grid>
    </Provider>
  );
}
export default Dashboard;