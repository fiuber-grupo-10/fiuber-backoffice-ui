import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Navbar from "./Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { getUser } from "../authStore";
import React, { useEffect, useState } from "react";
import { Grid, Paper } from '@mui/material';
import { urlUsers } from '../../vars'

function User() {
  const params = useParams();
  const [fetchedClient, setFetchedClient] = useState(false);
  var currentUser = getUser()
  const [user, loading, error] = useAuthState(auth);
  const [client, setClient] = useState([]);
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
    if (!fetchedClient) {
      const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + user.accessToken },
      };
      fetch(urlUsers + 'users/' + params.userId, requestOptions)
        .then(response => response.json())
        .then(response => {
          setClient(response)
          console.log(response);
          console.log(client);
        })
        .catch(err => alert('Error fetching user data'));
      setFetchedClient(true)
    }
  }, [currentUser, navigate, client, fetchedClient, error, loading, user, params.userId]);

  async function blockUser(block) {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + user.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          blocked: block
        }
      )
    };

    let userHasBeenBlocked = false;
    await fetch(urlUsers + 'users/block/' + params.userId, requestOptions)
      .then(response => {
        if (block) {
          userHasBeenBlocked = true;
          alert('User blocked')
        }
        else
          alert('User unblocked')
        console.log(response);
      })
      .catch(err => alert('Error blocking the user'));
    setFetchedClient(false)

    if (userHasBeenBlocked === true)
      await sendBlockedUserMetric();
  }

  async function sendBlockedUserMetric() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + user.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          event: "BLOCK",
          info: "User blocked by an admin"
        })
    };

    await fetch(urlUsers + 'events', requestOptions)
      .then(response => {        
        console.log('user blocked metric');
      })
      .catch(err => console.log('Error sending BLOCK metric'));
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
          <h1>User profile</h1>

          {(client !== '' && client !== undefined && client !== []) ?
            <div>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {client.email}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {client.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {client.uid}
                  </Typography>
                  <Typography variant="body2">
                    {client?.roles?.toString()}
                  </Typography>
                  {(client.blocked === true) ?
                    <Button size="small" onClick={async () => await blockUser(false)}>Unblock user</Button>
                    : <span></span>}

                  {(client.blocked === false || client?.blocked === undefined) ?
                    <Button size="small" onClick={async () => await blockUser(true)}>Block user</Button>
                    : <span></span>}
                </CardContent>
                <CardActions>
                  <Button onClick={() => navigate(-1)} size="small">go back</Button>
                </CardActions>
              </Card>

            </div>
            : <div>Error loading user data</div>}
        </Paper>
      </Grid>
    </Grid >
  );
}

export default User;