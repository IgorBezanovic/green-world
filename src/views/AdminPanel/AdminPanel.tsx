import { MetaTags } from '@green-world/components';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import clsx from 'clsx';
import { ChartNoAxesCombined } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

const drawerWidth = 220;

export const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <Box
      className={clsx('w-full', 'bg-whiteLinen', 'min-h-screen', 'relative')}
      sx={{ display: 'flex' }}
    >
      <MetaTags title={'Zeleni svet | Admin Panel'} />
      {/* Drawer meni */}
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
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/admin/google-analytics')}
              >
                <ListItemIcon>
                  <ChartNoAxesCombined className="ml-[12px]" />
                </ListItemIcon>
                <ListItemText primary="Google Analitika" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Glavni sadržaj */}
      <Box
        component="main"
        className={clsx('xl:max-w-[1400px]', 'w-full', 'mx-auto', 'p-[24px]')}
        sx={{ flexGrow: 1 }}
      >
        {/* Ovde će se renderovati child rute */}
        <Outlet />
      </Box>
    </Box>
  );
};
