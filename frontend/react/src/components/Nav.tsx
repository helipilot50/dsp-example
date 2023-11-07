import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import { useNavigate, useLocation, Link as RouterLink, Outlet } from 'react-router-dom';

import BreadCrumbs from '@mui/material/Breadcrumbs';
import { AppRoutes } from './Routes';
import Clerk from './auth/Clerk';
import { SignedIn } from '@clerk/clerk-react';



const drawerWidth = 220;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export function DSPBreadcrumbs() {
  const location = useLocation();
  let currentLink = '';
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`;
      return (
        <RouterLink
          color='inherit'
          key={crumb}
          to={currentLink}
        >
          {(crumb.length <= 15) ? crumb : crumb.substring(0, 15) + '...'}
        </RouterLink>
      );
    });
  return (
    <BreadCrumbs
      sx={{ ml: 1 }}>
      {crumbs}
    </BreadCrumbs>
  );
}


export function Nav() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            Not DSP
          </Typography>

          <DSPBreadcrumbs />

          <Box sx={{ marginLeft: "auto" }} >
            <Clerk />
          </Box>

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key='dashboard' disablePadding >
            <ListItemButton onClick={() => { navigate(`/`); }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItemButton>
          </ListItem>
          <SignedIn>
            <ListItem key='menuAccounts' disablePadding >
              <ListItemButton onClick={() => { navigate(`/accounts`); }}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary='Accounts' />
              </ListItemButton>
            </ListItem>
            <ListItem key='menuBrands' disablePadding >
              <ListItemButton onClick={() => { navigate(`/brands`); }}>
                <ListItemIcon>
                  <BrandingWatermarkIcon />
                </ListItemIcon>
                <ListItemText primary='Brands' />
              </ListItemButton>
            </ListItem>
            <ListItem key='menuProducts' disablePadding >
              <ListItemButton onClick={() => { navigate(`/products`); }}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary='Products' />
              </ListItemButton>
            </ListItem>
            <ListItem key='menuRetailers' disablePadding >
              <ListItemButton onClick={() => { navigate(`/retailers`); }}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary='Retailers' />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem key='menuPortfolios' disablePadding >
              <ListItemButton onClick={() => { navigate(`/portfolios`); }}>
                <ListItemIcon>
                  <LibraryBooks />
                </ListItemIcon>
                <ListItemText primary='Portfolios' />
              </ListItemButton>
            </ListItem>
          </SignedIn >
        </List>

      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <AppRoutes />
        <Outlet />
      </Main>
    </Box >
  );
}

