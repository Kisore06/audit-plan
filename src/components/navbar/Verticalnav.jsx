import React, { useState, useEffect, useRef } from 'react';
import './Vertical.css'; // Adjust the path as necessary
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';

const Sidebar = () => {
 const [open, setOpen] = useState(false);
 const drawerRef = useRef(null);

 useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
 }, []);

 const handleDrawerOpen = () => {
    setOpen(true);
 };

 const handleDrawerClose = () => {
    setOpen(false);
 };



 return (
    <>
      <nav className="sidebar-nav">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={open ? 'hide-icon' : ''}
          size="large"
          sx={{
            position: 'absolute',
            left: 10,
            top: 15,
          }}
        >
          <MenuIcon sx={{ fontSize: 25 }} />
        </IconButton>
      </nav>
      <Drawer
        ref={drawerRef}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        disableBackdropClick="true"
      >
        <div className="drawer-header">
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          {/* Navigation items */}
          <ListItemButton component={Link} to="/admin-register" onClick={handleDrawerClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          {/* Add other navigation items as needed */}
        </List>
      </Drawer>
    </>
 );
};

export default Sidebar;
