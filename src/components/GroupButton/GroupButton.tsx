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
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: 2,
        height: { xs: 200, sm: 250, lg: 280 },
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        [theme.breakpoints.up('lgm')]: {
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 4
          },
          '&:hover .group-overlay': {
            backgroundColor: theme.palette.common.white
          },
          '&:hover .group-text': {
            fontWeight: 600
          }
        }
      })}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1',
          backgroundImage: `url(${item?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          className="group-overlay"
          sx={(theme) => ({
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            pl: 2,
            [theme.breakpoints.up('xs')]: {
              pl: 1
            },
            [theme.breakpoints.up('md')]: {
              pl: 2
            }
          })}
        >
          <Typography
            className="group-text"
            variant="subtitle1"
            sx={(theme) => ({
              textTransform: 'uppercase',
              color: theme.palette.text.secondary,
              letterSpacing: 1,
              fontSize: {
                xs: theme.typography.subtitle2.fontSize,
                sm: theme.typography.subtitle1.fontSize
              },
              fontWeight: {
                xs: theme.typography.subtitle2.fontWeight,
                sm: theme.typography.subtitle1.fontWeight
              },
              lineHeight: {
                xs: theme.typography.subtitle2.lineHeight,
                sm: theme.typography.subtitle1.lineHeight
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
