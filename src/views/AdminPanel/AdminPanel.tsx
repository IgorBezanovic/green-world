'use client';

import { PageContent } from '@green-world/components';
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
import { useNavigate } from 'react-router';

const drawerWidth = 220;

export const AdminPanel = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <PageContent
      sx={{
        display: 'flex',
        backgroundColor: 'background.paper',
        position: 'relative'
      }}
    >
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
                  <ChartNoAxesCombined style={{ marginLeft: 12 }} />
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
        {children}
      </Box>
    </PageContent>
  );
};
