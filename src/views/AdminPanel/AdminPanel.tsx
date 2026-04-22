'use client';

import { PageContent } from '@green-world/components';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import {
  ChartNoAxesCombined,
  Users,
  ShoppingBag,
  Wrench,
  CalendarDays,
  BookOpen
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const drawerWidth = 220;

const NAV_ITEMS = [
  {
    label: 'Google Analitika',
    path: '/admin/google-analytics',
    icon: <ChartNoAxesCombined size={18} />
  },
  { label: 'Korisnici', path: '/admin/users', icon: <Users size={18} /> },
  {
    label: 'Proizvodi',
    path: '/admin/products',
    icon: <ShoppingBag size={18} />
  },
  { label: 'Usluge', path: '/admin/services', icon: <Wrench size={18} /> },
  {
    label: 'Događaji',
    path: '/admin/events',
    icon: <CalendarDays size={18} />
  },
  { label: 'Blogovi', path: '/admin/blogs', icon: <BookOpen size={18} /> }
];

export const AdminPanel = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <PageContent
      sx={{
        display: 'flex',
        backgroundColor: 'background.paper',
        position: 'relative'
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            position: 'absolute',
            boxSizing: 'border-box',
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #ddd',
            top: 0,
            zIndex: 10
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="text.secondary"
          >
            Admin Panel
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {NAV_ITEMS.map(({ label, path, icon }) => {
              const active = pathname.startsWith(path);
              return (
                <ListItem key={path} disablePadding>
                  <ListItemButton
                    selected={active}
                    onClick={() => navigate(path)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': { color: 'white' },
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          p: 2
        }}
      >
        {children}
      </Box>
    </PageContent>
  );
};
