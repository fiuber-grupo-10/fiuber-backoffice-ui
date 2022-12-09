import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListIcon from '@mui/icons-material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getUser } from "../authStore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Grid, Paper, Link, Button, TextField, Alert } from '@mui/material';
import Navbar from "./Navbar";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { urlBackoffice } from '../../vars'

function Rules() {
  const [fetchedRules, setFetchedRules] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [file, setFile] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rules, setRules] = useState([]);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [testResult, setTestResult] = useState('');
  const [testChanges, setTestChanges] = useState('');

  const [openList, setOpenList] = React.useState(true);
  const handleClickList = () => {
    setOpenList(!openList);
  };

  // form data
  const [driverTripsLastMonth, setDriverTripsLastMonth] = useState('');
  const [passengerTripsLastMonth, setPassengerTripsLastMonth] = useState('');
  const [tripMetersDistance, setTripMetersDistance] = useState('');
  const [hourOfTheDay, setHourOfTheDay] = useState('');
  const [totalTripsLastDay, setTotalTripsLastDay] = useState('');
  const [driverAccountSeniorityInDays, setDriverAccountSeniorityInDays] = useState('');
  const [passengerAccountSeniorityInDays, setPassengerAccountSeniorityInDays] = useState('');

  const [open, setOpen] = React.useState(false);

  function handleClickOpen(event) {
    event.stopPropagation()
    setOpen(true);
  };

  async function handleClose(event, toDelete, id) {
    event.stopPropagation()
    if (toDelete) {
      await deleteRule(id);
      setFetchedRules(false);
      console.log("deleting " + id)
    }
    setOpen(false);
  };

  const navigate = useNavigate();
  var currentUser = getUser()
  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'clickaway')
      return;

    setOpenSuccess(false);
    setSuccessMessage('');
  };

  function handleAndIgnore(event) {
    event.preventDefault();
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
    if (!fetchedRules) {
      const requestOptions = {
        method: 'GET',
      };
      fetch(urlBackoffice + 'rules', requestOptions)
        .then(response => response.json())
        .then(response => {
          setRules(response)
          console.log(response);
          console.log(rules);
        })
        .catch(err => alert('Error fetching rules'));
      setFetchedRules(true)
    }
  }, [currentUser, navigate, rules, fetchedRules, error, loading, user]);

  function handleCapture(event) {
    setHasFile(true);
    setFile(event.target.files[0]);
    event.target.value = null;
  };

  async function deleteRule(id) {
    const requestOptions = {
      method: 'DELETE',
    };
    await fetch(urlBackoffice + 'rules/' + id, requestOptions)
      .then(response => {
        setSuccessMessage('Deleted ruleset ' + id)
        setOpenSuccess(true);
      })
      .catch(err => alert('Error deleting the file.'));
  }

  async function sendFile() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await file.text()
    };
    await fetch(urlBackoffice + 'rules', requestOptions)
      .then(response => {
        setFetchedRules(false);
        setSuccessMessage('Created a new ruleset entry.')
        setOpenSuccess(true);
      })
      .catch(err => alert('Error creating the file.'));

    setFile(null);
    setHasFile(false);
  };

  async function handleSubmit(id) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: rules.find(rule => rule._id.toString() === id.toString()),
        testData: {
          driverTripsLastMonth: driverTripsLastMonth,
          passengerTripsLastMonth: passengerTripsLastMonth,
          tripMetersDistance: tripMetersDistance,
          hourOfTheDay: hourOfTheDay,
          totalTripsLastDay: totalTripsLastDay,
          driverAccountSeniorityInDays: driverAccountSeniorityInDays,
          passengerAccountSeniorityInDays: passengerAccountSeniorityInDays,
        }
      })
    };

    setDriverTripsLastMonth('')
    setPassengerTripsLastMonth('')
    setTripMetersDistance('')
    setHourOfTheDay('')
    setTotalTripsLastDay('')
    setDriverAccountSeniorityInDays('')
    setPassengerAccountSeniorityInDays('')

    await fetch(urlBackoffice + 'rules/test', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response.events);
        if (response.events.length === 0) {
          setTestResult('');
          setTestChanges('');
        }

        else {
          setTestResult(response.events);
          setTestChanges(response.changeLog);
        }

      })
      .catch(err => alert('Error testing data: ' + err));

  };

  async function activateRuleSet(id) {
    const requestOptions = { method: 'PUT' };
    await fetch(urlBackoffice + 'rules/' + id, requestOptions)
      .then(response => {
        setFetchedRules(false);
        setSuccessMessage('Altered the active ruleset.')
        setOpenSuccess(true);
      })
      .catch(err => alert('Error activating the new ruleset ' + err));
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
        <Paper elevation={10} style={{ padding: 20, height: '90%', width: '90%', margin: "20px auto" }}>

          <h1>Rules engine</h1>
          <Link href="https://www.json-rule-editor.com/"
            underline="none"
            target="_blank">
            {'Open the rule editor tool in a new tab'}
          </Link>
          <br />
          <br></br>
          <br></br>
          <div className="col-sm-12">
            <input accept="application/json"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleCapture}
            />

            <AttachFileIcon color="success" style={{ display: hasFile ? 'inline' : 'none' }} ></AttachFileIcon>
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" style={{ margin: 10, display: hasFile ? 'none' : 'inline' }}>
                Upload
              </Button>
            </label>

            <Button variant="outlined" component="span" style={{ margin: 10, display: hasFile ? 'inline' : 'none' }}
              onClick={() => {
                setFile(null);
                setHasFile(false);
              }}>
              Clear file
            </Button>
          </div>
          <br></br>
          <br></br>
          <br></br>
          {(testResult !== '' && testResult !== undefined) ?
            <div>
              <ListItemButton
                disabled={true}
                onClick={handleClickList}>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary="Test events result" />
                {<ExpandMore />}
              </ListItemButton>
              {testResult.map((event) => (
                <List component="div" disablePadding>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <EventAvailableIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={event} secondary="Event" />
                  </ListItem>
                </List>

              ))}

              {(testChanges !== '' && testChanges !== undefined) ?
                testChanges.map((change) => (
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PublishedWithChangesIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={change} secondary="Changes"/>
                    </ListItem>
                  </List>
                ))
                : <span>No changes detected</span>
              }

            </div>
            : <div>No events in last test result</div>}
          <br></br>
          <div className="col-sm-12">
            <Button variant={hasFile ? 'contained' : 'disabled'}
              color={hasFile ? 'success' : ''}
              component="span" style={{ margin: 10 }}
              onClick={sendFile}>
              SEND
            </Button>
          </div>
          <div>
            {rules.map((row) => (
              <Accordion expanded={expanded === 'panel' + row._id} onChange={handleChange('panel' + row._id)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: '20%', flexShrink: 0 }}>
                    <strong>Rule code:</strong> <em>{row._id}</em>
                  </Typography>
                  <Typography sx={{ width: '30%', flexShrink: 0, color: 'text.secondary' }}>Created: {new Date(row.createdAt).toDateString() + ' ' + new Date(row.createdAt).toLocaleTimeString()}</Typography>

                  <FormControlLabel
                    sx={{ width: '20%', flexShrink: 0 }}
                    label={row.isActive ? "Active" : "Inactive"}
                    onClick={(event) => event.stopPropagation()}
                    control={
                      <Checkbox checked={row.isActive} disabled={row.isActive} onClick={async event => {
                        event.stopPropagation();
                        await activateRuleSet(row._id);
                      }} />
                    }
                  />

                  <Button sx={{ width: '10%', flexShrink: 0 }} variant={row.isActive ? 'contained' : 'outlined'}
                    onClick={(event) => event.stopPropagation()}
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                      JSON.stringify(row.content)
                    )}`}
                    download={row._id + ".json"}>
                    {`Download `}
                  </Button>

                  <Button variant="danger" sx={{ width: '15%', flexShrink: 0 }}
                    disabled={row.isActive}
                    onClick={handleClickOpen
                    }>
                    DELETE
                  </Button>
                  <Dialog
                    open={open}
                    onClose={async e => await handleClose(e, false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Are you sure you want to delete " + row._id + " ruleset?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        You're about to delete a legacy ruleset. This action cannot be undone.
                        Select <strong>DELETE</strong> to proceed with the deletion, or <strong>CANCEL</strong> to go back
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={async e => await handleClose(e, false)}>cancel</Button>
                      <Button onClick={async e => await handleClose(e, true, row._id)} autoFocus>
                        delete
                      </Button>
                    </DialogActions>
                  </Dialog>

                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <TextField
                      sx={{ width: '100%', flexShrink: 0 }}
                      id="outlined-multiline-static"
                      label="Definition"
                      multiline
                      disabled={true}
                      value={JSON.stringify(row.content)}
                    />
                  </Typography>
                  <form onSubmit={handleAndIgnore} id="create-admin-form">
                    <TextField label="Driver trips (last month)" variant="outlined"
                      name="driverTripsLastMonth"
                      sx={{ width: '10%', flexShrink: 0 }}
                      value={driverTripsLastMonth}
                      style={{ margin: 10 }}
                      onChange={e => setDriverTripsLastMonth(e.target.value)} />

                    <TextField label="Passenger trips (last month)" variant="outlined"
                      name="passengerTripsLastMonth"
                      value={passengerTripsLastMonth}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      onChange={e => setPassengerTripsLastMonth(e.target.value)} />

                    <TextField label="Trip distance (meters)" variant="outlined"
                      name="tripMetersDistance"
                      value={tripMetersDistance}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      type="number"
                      onChange={e => setTripMetersDistance(e.target.value)} />

                    <TextField label="Hour (0-24)" variant="outlined"
                      name="hourOfTheDay"
                      value={hourOfTheDay}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      type="number"
                      onChange={e => setHourOfTheDay(e.target.value)} />

                    <TextField label="Total trips last day" variant="outlined"
                      name="totalTripsLastDay"
                      value={totalTripsLastDay}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      type="number"
                      onChange={e => setTotalTripsLastDay(e.target.value)} />

                    <TextField label="Driver seniority (days)" variant="outlined"
                      name="driverAccountSeniorityInDays"
                      value={driverAccountSeniorityInDays}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      type="number"
                      onChange={e => setDriverAccountSeniorityInDays(e.target.value)} />

                    <TextField label="Passenger seniority (days)" variant="outlined"
                      name="passengerAccountSeniorityInDays"
                      value={passengerAccountSeniorityInDays}
                      sx={{ width: '10%', flexShrink: 0 }}
                      style={{ margin: 10 }}
                      type="number"
                      onChange={e => setPassengerAccountSeniorityInDays(e.target.value)} />
                    <Button
                      onClick={() => handleSubmit(row._id)}
                      type="submit" style={{ margin: 10 }}
                      sx={{ width: '10%', flexShrink: 0 }}
                      variant="contained"
                      name="search-button" >
                      test rules
                    </Button>
                  </form>
                  <br></br>
                  <Typography>
                    <strong>Result</strong>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Paper>
        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '200%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
}

export default Rules;