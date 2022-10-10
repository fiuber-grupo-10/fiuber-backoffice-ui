import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, getAllUsers } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Grid, Paper, Typography } from '@mui/material';
import Navbar from "./Navbar";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const users=  await getAllUsers();
    setUsers(users);
  }

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
    fetchUsers();
  });
  return (    
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
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Name</TableCell>  
            <TableCell align="right">Provider</TableCell>            
            <TableCell align="right">ID</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.authProvider}</TableCell>              
              <TableCell align="right">{row.uid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default Dashboard;