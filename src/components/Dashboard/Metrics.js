import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Navbar from "./Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getUser } from "../authStore";
import React, { useEffect, useState } from "react";
import { Grid, Paper } from '@mui/material';
import { urlUsers, urlPayments } from '../../vars'

function Metrics() {
  const WEEK_IN_MILISECONDS = 604800000;
  var currentUser = getUser()
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [fetchedPaymentsMetrics, setFetchedPaymentsMetrics] = useState(false);  
  const [paymentsMetrics, setPaymentsMetrics] = useState([]);  
  
  const [metricRegister, setMetricRegister] = useState(0);
  const [metricFederatedRegister, setMetricFederatedRegister] = useState(0);
  const [metricLogin, setMetricLogin] = useState(0);
  const [metricFederatedLogin, setMetricFederatedLogin] = useState(0);
  const [metricBlock, setMetricBlock] = useState(0);
  const [metricPasswordRecovery, setMetricPasswordRecovery] = useState(0);
  

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/fiuber-backoffice-ui/");
    if (!currentUser) return navigate("/fiuber-backoffice-ui/");
    if (!currentUser.roles.includes("admin")) {
      return navigate("/fiuber-backoffice-ui/unauthorized");
    }
    if (error) {
      alert(error)
    }

    const requestOptions = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + user.accessToken },
    };

    if (!fetchedPaymentsMetrics) {
      fetch(urlPayments + 'transactions/metrics', requestOptions)
        .then(response => response.json())
        .then(response => {
          setPaymentsMetrics(response)
          console.log(response);
        })
        .catch(err => console.log('Error fetching payments data'));
      setFetchedPaymentsMetrics(true)
    }

    if (!fetchedPaymentsMetrics){
      fetch(urlUsers + 'events?type=REGISTER&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricRegister(response.length)          
        })
        .catch(err => console.log('Error fetching REGISTER data'));


        fetch(urlUsers + 'events?type=FEDERATED_REGISTER&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricFederatedRegister(response.length)          
        })
        .catch(err => console.log('Error fetching FEDERATED_REGISTER data'));


        fetch(urlUsers + 'events?type=LOGIN&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricLogin(response.length)          
        })
        .catch(err => console.log('Error fetching LOGIN data'));


        fetch(urlUsers + 'events?type=FEDERATED_LOGIN&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricFederatedLogin(response.length)          
        })
        .catch(err => console.log('Error fetching FEDERATED_LOGIN data'));


        fetch(urlUsers + 'events?type=BLOCK&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricBlock(response.length)          
        })
        .catch(err => console.log('Error fetching BLOCK data'));


        fetch(urlUsers + 'events?type=PASSWORD_RECOVERY&time_window='+WEEK_IN_MILISECONDS, requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setMetricPasswordRecovery(response.length)          
        })
        .catch(err => console.log('Error fetching PASSWORD_RECOVERY data'));


      setFetchedPaymentsMetrics(true)
    }
  }, [currentUser, navigate, setPaymentsMetrics, fetchedPaymentsMetrics, error, loading, user]);


  const rows = [];
  for (const property in paymentsMetrics) {
    rows.push(<TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{property}</TableCell>
      <TableCell align="left">{paymentsMetrics[property]}</TableCell>
    </TableRow>);    
  }

  return (
    <Grid style={{ height: '100vh', width: '100vw', alignItems: 'center' }} >
      <Navbar />
      <Grid
        direction="column"
        alignItems="center"
        justifyContent="center"
        display="flex"
        style={{ width: '100vw', alignItems: 'center' }}
      >
        <Paper elevation={10} style={{ padding: 20, height: '90%', width: '40%', margin: "20px auto" }}>
          <h1>Payment Metrics</h1>
          {(paymentsMetrics !== '' && paymentsMetrics !== undefined && paymentsMetrics !== []) ?
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Metric name</TableCell>
                      <TableCell align="left">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows}
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
            : <div>Error loading payments metrics</div>}
        </Paper>
        <Paper elevation={10} style={{ padding: 20, height: '90%', width: '40%', margin: "20px auto" }}>
          <h1>Users Metrics</h1>
          <h2>Past week</h2>
          {(paymentsMetrics !== '' && paymentsMetrics !== undefined && paymentsMetrics !== []) ?
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 100 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">REGISTER</TableCell>
                      <TableCell align="left">{metricRegister}</TableCell>
                    </TableRow>                    
                  </TableHead>
                  <TableBody>
                  <TableRow>
                      <TableCell align="left">FEDERATED_REGISTER</TableCell>
                      <TableCell align="left">{metricFederatedRegister}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">LOGIN</TableCell>
                      <TableCell align="left">{metricLogin}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">FEDERATED_LOGIN</TableCell>
                      <TableCell align="left">{metricFederatedLogin}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">BLOCK</TableCell>
                      <TableCell align="left">{metricBlock}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">PASSWORD_RECOVERY</TableCell>
                      <TableCell align="left">{metricPasswordRecovery}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
            : <div>Error loading payments metrics</div>}
        </Paper>
      </Grid>
    </Grid >
  );
}

export default Metrics;