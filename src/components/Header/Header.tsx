import { Logo } from '@green-world/components';
import { getItem, removeItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  ListItemButton
} from '@mui/material';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  UserPen,
  Menu as MenuLucide,
  PackagePlus,
  Mail,
  MapPinPlus,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
    setDrawerOpen(false);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleUser = () => {
    if (decodedToken?._id) {
      handleToggleDrawer();
    } else {
      navigate('/login');
    }
  };

  const menuItems = [
    {
      text: 'Korisnički Profil',
      icon: <User className="!w-6 !h-6 ml-2" />,
      onClick: () => navigate('/profile')
    },
    {
      text: 'Kreiraj proizvod',
      icon: <PackagePlus className="!w-6 !h-6 ml-2" />,
      onClick: () => navigate('/create-product')
    },
    {
      text: 'Kreiraj aktivnost',
      icon: <MapPinPlus className="!w-6 !h-6 ml-2" />,
      onClick: () => navigate('/create-event')
    },
    {
      text: 'Podešavanje profila',
      icon: <UserPen className="!w-6 !h-6 ml-2" />,
      onClick: () => navigate('/profile-settings/edit-profile')
    },
    {
      text: 'Kontaktirajte nas',
      icon: <Mail className="!w-6 !h-6 ml-2" />,
      onClick: () => navigate('/contact-us')
    }
  ];

  return (
    <Box
      component="header"
      className={clsx(
        'sticky inset-x-0 top-0 z-20 bg-teaGreen shadow px-4 sm:px-7 xl:px-0 py-3'
      )}
    >
      <Box className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Logo />
        <Button
          variant="outlined"
          color="inherit"
          sx={{ textTransform: 'uppercase' }}
          onClick={handleUser}
        >
          {decodedToken?._id ? (
            <MenuLucide className="!w-6 !h-6 !text-inherit" />
          ) : (
            'Prijavi se'
          )}
        </Button>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer}>
        <Box
          sx={{
            width: 250,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            py: 2
          }}
          role="presentation"
        >
          {/* Glavni meni */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItemButton key={item.text} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Logout - footer */}
          <Box>
            <List>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut className="!w-6 !h-6 ml-2" />
                </ListItemIcon>
                <ListItemText primary="Izloguj se" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
