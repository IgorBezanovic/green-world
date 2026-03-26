import { LanguageSwitcher } from '@green-world/components/LanguageSwitcher';
import UserContext from '@green-world/context/UserContext';
import { useUserMessage } from '@green-world/hooks/useUserMessage';
import { removeItem } from '@green-world/utils/cookie';
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
  NotebookText,
  BriefcaseBusiness
} from 'lucide-react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { AISearch } from '../AISearch';
import { ZSLogoHorizontal } from '../AppLogos';

export const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, isUserLoggedIn } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { t } = useTranslation();

  const { data: messagesData } = useUserMessage();
  const conversations = messagesData?.data ?? [];
  const totalUnread =
    conversations.reduce(
      (sum: number, conv: any) => sum + (conv.unreadCount || 0),
      0
    ) || 0;

  const handleLogout = () => {
    removeItem('token');
    navigate('/');
    setDrawerOpen(false);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleUser = () => {
    if (isUserLoggedIn) {
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
      text: t('header.profile'),
      icon: <User style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () => handleMenuClick(() => navigate('/profile'))
    },
    {
      text: t('header.addProduct'),
      icon: <PackagePlus style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () => handleMenuClick(() => navigate('/create-product')),
      disabled: user?.numberOfProducts >= user?.maxShopProducts
    },
    {
      text: t('header.addService'),
      icon: (
        <BriefcaseBusiness style={{ width: 24, height: 24, marginLeft: 8 }} />
      ),
      onClick: () => handleMenuClick(() => navigate('/services/create'))
    },
    {
      text: t('header.writeBlog'),
      icon: <NotebookText style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () => handleMenuClick(() => navigate('/write-post'))
    },
    {
      text: t('header.createEvent'),
      icon: <MapPinPlus style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () => handleMenuClick(() => navigate('/create-event'))
    },
    {
      text: t('header.profileSettings'),
      icon: <UserPen style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () =>
        handleMenuClick(() => navigate('/profile-settings/edit-profile'))
    },
    {
      text: t('header.contactUs'),
      icon: <Mail style={{ width: 24, height: 24, marginLeft: 8 }} />,
      onClick: () => handleMenuClick(() => navigate('/contact-us'))
    },
    {
      text: t('header.messages'),
      icon: (
        <Badge
          badgeContent={totalUnread > 0 ? totalUnread : null}
          color="error"
          overlap="circular"
        >
          <MessageCircle style={{ width: 24, height: 24, marginLeft: 8 }} />
        </Badge>
      ),
      onClick: () => handleMenuClick(() => navigate('/message'))
    }
  ];

  const toggleMobileSearch = () => setMobileSearchOpen((prev) => !prev);

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: (theme) => theme.palette.background.main,
        boxShadow: '0 1px 3px rgb(0 0 0 / 0.10), 0 1px 2px rgb(0 0 0 / 0.06)',
        px: '16px',
        py: '12px',
        [theme.breakpoints.up('sm')]: {
          px: '28px'
        },
        [theme.breakpoints.up('xl')]: {
          px: 0
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '1400px',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          zIndex: (theme) => theme.zIndex.modal + 10
        }}
      >
        <Box
          onClick={() => navigate('/')}
          sx={{
            width: '10rem',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <ZSLogoHorizontal color={theme.palette.secondary.main} />
        </Box>

        <Box
          sx={{
            flex: 1,
            maxWidth: '700px',
            display: 'none',
            [theme.breakpoints.up('md')]: {
              display: 'block'
            }
          }}
        >
          <AISearch />
        </Box>

        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            [theme.breakpoints.up('sm')]: {
              gap: 2
            },
            [theme.breakpoints.up('md')]: {
              gap: 4
            }
          })}
        >
          <IconButton
            onClick={toggleMobileSearch}
            sx={{ [theme.breakpoints.up('md')]: { display: 'none' } }}
            aria-label="Search in application"
          >
            <Search style={{ width: 24, height: 24, color: 'inherit' }} />
          </IconButton>
          <Button
            variant="outlined"
            color="inherit"
            sx={(theme) => ({
              textTransform: 'uppercase',
              display: 'inline-flex',
              minWidth: 'auto',
              px: 1.2,
              py: 0.4,
              fontSize: '0.7rem',
              [theme.breakpoints.up('sm')]: {
                px: 1.5,
                fontSize: '0.75rem'
              },
              [theme.breakpoints.up('md')]: {
                px: 2,
                py: 0.6,
                fontSize: '0.875rem'
              }
            })}
            onClick={handleUser}
            aria-label="Menu"
          >
            {isUserLoggedIn ? (
              <MenuLucide style={{ width: 24, height: 24, color: 'inherit' }} />
            ) : (
              t('header.login')
            )}
          </Button>
        </Box>
      </Box>

      {mobileSearchOpen && (
        <Box
          sx={{
            mt: 5,
            transition: 'all 0.3s ease',
            [theme.breakpoints.up('md')]: {
              display: 'none'
            }
          }}
        >
          <AISearch />
        </Box>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleToggleDrawer}
        sx={{
          zIndex: (theme) => theme.zIndex.tooltip + 100,
          '& .MuiDrawer-paper': {
            zIndex: (theme) => theme.zIndex.tooltip + 101
          }
        }}
      >
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
                  // disabled={Boolean(item.disabled)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Box>
            <List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <LanguageSwitcher />
              </Box>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut style={{ width: 24, height: 24, marginLeft: 8 }} />
                </ListItemIcon>
                <ListItemText primary={t('header.logout')} />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
