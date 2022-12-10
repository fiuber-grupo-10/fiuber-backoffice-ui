import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Tooltip from '@mui/material/Tooltip';
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
import Avatar from '@mui/material/Avatar';
import PendingIcon from '@mui/icons-material/Pending';
import CheckIcon from '@mui/icons-material/Check';
import { Grid, Paper } from '@mui/material';
import { urlPayments } from '../../vars'

function Transactions() {
  const [fetchedTransactions, setFetchedTransactions] = useState(false);
  var currentUser = getUser()
  const [user, loading, error] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [transactionsFiltered, setTransactionsFiltered] = useState([]);
  const [value, setValue] = React.useState('all');

  const handleChange = (event) => {
    setValue(event.target.value);
    if (event.target.value === "all")
      setTransactionsFiltered(transactions);
    else
      setTransactionsFiltered(transactions.filter(tx => tx.status === event.target.value))

  };
  const navigate = useNavigate();

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
    if (!fetchedTransactions) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + user.accessToken },
      };
      fetch(urlPayments + 'transactions', requestOptions)
        .then(response => response.json())
        .then(response => {          
          setTransactions(response)
          setTransactionsFiltered(response)
        })
        .catch(err => alert('Error fetching transactions'));
      setFetchedTransactions(true)
    }
  }, [currentUser, navigate, transactions, fetchedTransactions, error, loading, user]);


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
        <Paper elevation={10} style={{ padding: 20, height: '90%', width: '90%', margin: "20px auto" }}>
          <h1>Transactions</h1>

          {(transactions !== '' && transactions !== undefined) ?
            <div>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  <FormControlLabel value="all" control={<Radio />} label="All" />
                  <FormControlLabel value="pending_driver" control={<Radio />} label="Pending Driver" />
                  <FormControlLabel value="pending_passenger" control={<Radio />} label="Pending Passenger" />
                  <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                </RadioGroup>
              </FormControl>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Hash</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Trip Id</TableCell>
                      <TableCell align="right">Sender Id</TableCell>
                      <TableCell align="right">Receiver Id</TableCell>
                      <TableCell align="right">Created</TableCell>
                      <TableCell align="right">Last Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionsFiltered.map((tx) => (
                      <TableRow
                        key={tx.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {tx.status === "completed" ?
                            <Tooltip title="Completed">
                              <CheckIcon>
                                <Avatar>
                                  <span primary={tx.status} secondary="Event" />
                                </Avatar>
                              </CheckIcon>
                            </Tooltip>
                            :
                            <Tooltip title="Pending">
                              <PendingIcon>
                                <Avatar>
                                  <span primary={tx.status} secondary="Event" />
                                </Avatar>
                              </PendingIcon>
                            </Tooltip>
                          }
                        </TableCell>
                        <TableCell align="right">{tx.txHash}</TableCell>
                        <TableCell align="right">{tx.amount}</TableCell>
                        <TableCell align="right">{tx?.tripId}</TableCell>
                        <TableCell align="right">{tx.senderId}</TableCell>
                        <TableCell align="right">{tx.receiverId}</TableCell>
                        <TableCell align="right">{tx.createdAt}</TableCell>
                        <TableCell align="right">{tx.updatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            : <div>No transactions to show</div>}
        </Paper>
      </Grid>
    </Grid >
  );
}

export default Transactions;