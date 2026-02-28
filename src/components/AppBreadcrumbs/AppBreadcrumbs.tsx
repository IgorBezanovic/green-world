import { Breadcrumbs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Page {
  label: string;
  route: string;
}

interface AppBreadcrumbsProps {
  pages: Page[];
}

export const AppBreadcrumbs = ({ pages }: AppBreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pages?.map((page, index) => {
        const isLast = index === pages.length - 1;

        return (
          <Typography
            key={index}
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: !isLast ? 'pointer' : 'default',
              textDecoration: isLast ? 'underline' : 'none',
              '&:hover': {
                textDecoration: {
                  xs: 'none',
                  md: 'underline'
                }
              }
            }}
            onClick={() => !isLast && navigate(page.route)}
          >
            {page.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};
