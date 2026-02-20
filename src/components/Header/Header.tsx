import UserContext from '@green-world/context/UserContext';
import { useLogout } from '@green-world/hooks/useLogout';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { getItem } from '@green-world/utils/cookie';
import { DecodedToken } from '@green-world/utils/types';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  ListItemButton,
  IconButton,
  useTheme,
  Badge
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  UserPen,
  Menu as MenuLucide,
  PackagePlus,
  Mail,
  MapPinPlus,
  LogOut,
  Search,
  MessageCircle,
  NotebookText
} from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { AISearch } from '../AISearch';
import { ZSLogoHorizontal } from '../AppLogos';

export const Header = () => {
  const navigate = useNavigate();
  const token = getItem('token');
  const theme = useTheme();
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const { user } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { data: messagesData } = useUserMessage();
  const conversations = messagesData?.data ?? [];
  const totalUnread =
    conversations.reduce(
      (sum: number, conv: any) => sum + (conv.unreadCount || 0),
      0
    ) || 0;

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
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

  const handleMenuClick = (callback: () => void) => {
    setDrawerOpen(false);
    callback();
  };

  const menuItems = [
    {
      text: 'Korisnički Profil',
      icon: <User className="!w-6 !h-6 ml-2" />,
      onClick: () => handleMenuClick(() => navigate('/profile'))
    },
    {
      text: 'Dodaj proizvod',
      icon: <PackagePlus className="!w-6 !h-6 ml-2" />,
      onClick: () => handleMenuClick(() => navigate('/create-product')),
      disabled: user?.numberOfProducts >= user?.maxShopProducts
    },
    {
      text: 'Kreiraj aktivnost',
      icon: <MapPinPlus className="!w-6 !h-6 ml-2" />,
      onClick: () => handleMenuClick(() => navigate('/create-event'))
    },
    {
      text: 'Podešavanje profila',
      icon: <UserPen className="!w-6 !h-6 ml-2" />,
      onClick: () =>
        handleMenuClick(() => navigate('/profile-settings/edit-profile'))
    },
    {
      text: 'Kontaktirajte nas',
      icon: <Mail className="!w-6 !h-6 ml-2" />,
      onClick: () => handleMenuClick(() => navigate('/contact-us'))
    },
    {
      text: 'Poruke',
      icon: (
        <Badge
          badgeContent={totalUnread > 0 ? totalUnread : null}
          color="error"
          overlap="circular"
        >
          <MessageCircle className="!w-6 !h-6 ml-2" />
        </Badge>
      ),
      onClick: () => handleMenuClick(() => navigate('/message'))
    },
    {
      text: 'Napiši blog',
      icon: <NotebookText className="!w-6 !h-6 ml-2" />,
      onClick: () => handleMenuClick(() => navigate('/write-post'))
    }
  ];

  const toggleMobileSearch = () => setMobileSearchOpen((prev) => !prev);

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: (theme) => theme.palette.background.main
      }}
      className="shadow px-4 sm:px-7 xl:px-0 py-3"
    >
      <Box
        className="relative max-w-[1400px] mx-auto flex items-center justify-between gap-6"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 10 }}
      >
        <Box
          onClick={() => navigate('/')}
          className="w-40 flex items-center cursor-pointer"
        >
          <ZSLogoHorizontal color={theme.palette.secondary.main} />
        </Box>

        <Box className="flex-1 max-w-[700px] hidden md:block">
          <AISearch />
        </Box>

        <Box className="flex items-center gap-4">
          <IconButton
            onClick={toggleMobileSearch}
            className="md:!hidden"
            aria-label="Search in application"
          >
            <Search className="!w-6 !h-6 !text-inherit" />
          </IconButton>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ textTransform: 'uppercase' }}
            onClick={handleUser}
            className="hidden md:block"
            aria-label="Menu"
          >
            {decodedToken?._id ? (
              <MenuLucide className="!w-6 !h-6 !text-inherit" />
            ) : (
              'Prijavi se'
            )}
          </Button>
        </Box>
      </Box>

      {mobileSearchOpen && (
        <Box className="mt-5 md:hidden transition-all duration-300">
          <AISearch />
        </Box>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer}>
        <Box
          sx={{
            width: 250,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            zIndex: (theme) => theme.zIndex.modal + 100
          }}
          role="presentation"
        >
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List>
              {menuItems?.map((item) => (
                <ListItemButton
                  key={item.text}
                  onClick={item.onClick}
                  disabled={Boolean(item.disabled)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>

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
