import Snackbar from '@mui/material/Snackbar';
import { getUser } from "../authStore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Grid, Paper, Button, TextField, Alert } from '@mui/material';
import Navbar from "./Navbar";
import { urlUsers } from '../../vars'

function Admins() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  var currentUser = getUser()

  const [errorStyle, setErrorStyle] = useState('none');
  const [openSuccess, setOpenSuccess] = React.useState(false);

  const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'clickaway')
      return;

    setOpenSuccess(false);
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
  }, [currentUser, navigate, error, loading, user]);

  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordSecondInput: "",
  });
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  function handleFormChange(event) {
    let data = formData;
    data[event.target.name] = event.target.value;
    setFormData(data);
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (validate(formData)) {
      createAdmin(formData)
    } else {
      errorStyle("The form is invalid. Pleashe check your data.")
    }
  };

  const validate = values => {
    console.log(values);
    if (values.adminName !== '' &&
      values.adminEmail !== '' &&
      values.adminPassword !== '' &&
      values.adminPasswordSecondInput !== '' &&
      values.adminPassword === values.adminPasswordSecondInput
    ) {
      setIsFormInvalid(false);
      setErrorStyle('none');
      return true;
    } else {
      setIsFormInvalid(true);
      setErrorStyle('flexbox');
      return false;
    }

  };

  const createAdmin = async (formData) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.accessToken
      },
      body: JSON.stringify(
        {
          email: formData.adminEmail,
          password: formData.adminPassword,
          name: formData.adminName
        }
      )
    };
    fetch(urlUsers + 'admins/', requestOptions)
      .then(response => response.json())
      .then(response => {        
        if (response.uid)
          setOpenSuccess(true);
        else
          alert('Error: ' + response.message)
      })
      .catch(err => alert('There has been an error creating the user: ' + err))
  };

  return (
    <Grid
      style={{ height: '100vh', width: '100vw', alignItems: 'center' }} I>
      <Navbar />
      <Grid display="flex" style={{ height: '94vh', width: '100vw', alignItems: 'center' }}>
        <Paper
          elevation={10}
          style={{ padding: 20, height: '90%', width: '90%', margin: "20px auto" }}>

          <div className="col-sm-12">
            <Alert severity="error" sx={{ display: errorStyle }} >Invalid data, please fix it and try again.</Alert>
            <h1>Create a FIUBER administrator  </h1>

            <form onSubmit={handleSubmit} id="create-admin-form">
              <TextField
                label="Name"
                variant="outlined"
                required="true"
                name="adminName"
                defaultValue={formData.adminName}
                style={{ margin: 10 }}
                onChange={handleFormChange}
              />
              <TextField
                label="E-mail"
                variant="outlined"
                required={true}
                name="adminEmail"
                defaultValue={formData.adminEmail}
                style={{ margin: 10 }}
                onChange={handleFormChange}
              />
              <TextField
                label="Password"
                variant="outlined"
                required={true}
                type="password"
                name="adminPassword"
                error={isFormInvalid}
                helperText={isFormInvalid && "Password required"}
                defaultValue={formData.adminPassword}
                style={{ margin: 10 }}
                onChange={handleFormChange}
              />
              <TextField
                label="Repeat password"
                variant="outlined"
                type="password"
                required={true}
                name="adminPasswordSecondInput"
                error={isFormInvalid}
                helperText={isFormInvalid && "Passwords must match"}
                defaultValue={formData.adminPasswordSecondInput}
                style={{ margin: 10 }}
                onChange={handleFormChange}
              />

              <Button type="submit" style={{ margin: 10 }} variant="contained" name="search-button" onClick={validate}>
                Create
              </Button>
            </form>
          </div>
          <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
            <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '200%' }}>
              The user <b>{formData.adminName}</b> has been created!
            </Alert>
          </Snackbar>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Admins;