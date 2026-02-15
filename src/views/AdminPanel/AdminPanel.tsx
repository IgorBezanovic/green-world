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
import { ChartNoAxesCombined } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

const drawerWidth = 220;

export const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: 'background.paper',
        position: 'relative',
        minHeight: 'calc(100vh - 360px)'
      }}
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
        sx={{
          flexGrow: 1,
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          p: 2
        }}
      >
        {/* Ovde će se renderovati child rute */}
        <Outlet />
      </Box>
    </Box>
  );
};
