import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";

export default function Navbar() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
      if (loading) return;
      if (!user) return navigate("/fiuber-backoffice-ui/");
      if (error) { 
        alert(error)
      }

    });

    const handleMenu = (event) => {
        setOpenMenu(event.currentTarget);
    };

    const handleClose = () => {
        setOpenMenu(null);
    };

    const navigateProfile = () => {
        navigate('/fiuber-backoffice-ui/profile');
    };

    const navigateDashboard = () => {
        navigate('/fiuber-backoffice-ui/dashboard');
    };

    const navigateAdmins = () => {
        navigate('/fiuber-backoffice-ui/admins');
    };    

    const navigateRules = () => {
        navigate('/fiuber-backoffice-ui/rules');
    }; 

    const navigateTransactions = () => {
        navigate('/fiuber-backoffice-ui/transactions');
    }; 

    const navigateMetrics = () => {
        navigate('/fiuber-backoffice-ui/metrics');
    }; 

    return (
        <AppBar style={{height:'6vh'}} position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FIUBER
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={openMenu}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openMenu}
                        onClose={handleClose}
                        >
                        <MenuItem onClick={navigateProfile}>Profile</MenuItem>
                        <MenuItem onClick={navigateDashboard}>Dashboard</MenuItem>
                        <MenuItem onClick={navigateAdmins}>Manage Admins</MenuItem>
                        <MenuItem onClick={navigateRules}>Manage Rules</MenuItem>
                        <MenuItem onClick={navigateTransactions}>Transactions List</MenuItem>
                        <MenuItem onClick={navigateMetrics}>Metrics</MenuItem>
                        <MenuItem onClick={logout}>Log out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>

  );
}
