import { Logo } from '@green-world/components';
import { getItem, removeItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import { Settings, Logout } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    return decodedToken?._id ? handleClick(e) : navigate('/login');
  };

  return (
    <Box
      component="header"
      className={clsx(
        'sticky',
        'inset-x-0',
        'top-0',
        'z-20',
        'bg-teaGreen',
        'shadow',
        'px-4',
        'sm:px-7',
        'xl:px-0',
        'py-3'
      )}
    >
      <Box
        component="nav"
        className={clsx(
          'max-w-[1400px]',
          'mx-auto',
          'flex',
          'items-center',
          'justify-between'
        )}
      >
        <Logo />
        <Button
          variant="outlined"
          color="inherit"
          sx={{ textTransform: 'uppercase' }}
          onClick={handleUser}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {decodedToken?._id ? <PersonOutlineOutlinedIcon /> : 'Prijavi se'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0
                }
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profil
          </MenuItem>
          <MenuItem onClick={() => navigate('/create-product')}>
            <ListItemIcon>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            Kreiraj proizvod
          </MenuItem>
          <MenuItem onClick={() => navigate('/create-event')}>
            <ListItemIcon>
              <PostAddIcon fontSize="small" />
            </ListItemIcon>
            Kreiraj aktivnost
          </MenuItem>
          <MenuItem onClick={() => navigate('/profile-settings/edit-profile')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Podesavanje profila
          </MenuItem>
          <MenuItem onClick={() => navigate('/contact-us')}>
            <ListItemIcon>
              <MailOutlineIcon fontSize="small" />
            </ListItemIcon>
            Kontaktirajte nas
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
