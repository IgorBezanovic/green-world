import { HomeCategory } from '@green-world/utils/types';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface GroupButtonProps {
  item: HomeCategory;
}

export const GroupButton = ({ item }: GroupButtonProps) => {
  return (
    <MuiLink
      component={RouterLink}
      to={item?.route}
      aria-label={item?.text}
      underline="none"
      sx={(theme) => ({
        display: 'block',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 1,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        [theme.breakpoints.up('lgm')]: {
          '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: 2
          },
          '&:hover .group-overlay': {
            backgroundColor: theme.palette.common.white
          }
        }
      })}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundImage: `url(${item?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          className="group-overlay"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            className="group-text"
            variant="subtitle2"
            sx={(theme) => ({
              textTransform: 'uppercase',
              color: theme.palette.text.secondary,
              letterSpacing: 1,
              ml: 2,
              [theme.breakpoints.up('xs')]: {
                ml: 1
              },
              [theme.breakpoints.up('md')]: {
                ml: 2
              },
              [theme.breakpoints.down('md')]: {
                width: '90%',
                mx: 'auto',
                textAlign: 'center'
              }
            })}
          >
            {item.text}
          </Typography>
        </Box>
      </Box>
    </MuiLink>
  );
};
