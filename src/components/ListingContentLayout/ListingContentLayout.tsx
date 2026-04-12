import { Box, Button, Grow } from '@mui/material';
import type { ReactNode } from 'react';

type ListingContentLayoutProps = {
  breadcrumbs: ReactNode;
  filters: ReactNode;
  content: ReactNode;
  pagination?: ReactNode;
  summary?: ReactNode;
  isTablet: boolean;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  openFiltersLabel: string;
  closeFiltersLabel: string;
  sidebarWidth?: number | string;
  filtersTopOffset?: number | string;
};

export const ListingContentLayout = ({
  breadcrumbs,
  filters,
  content,
  pagination,
  summary,
  isTablet,
  isFiltersOpen,
  onToggleFilters,
  openFiltersLabel,
  closeFiltersLabel,
  sidebarWidth = 280,
  filtersTopOffset = 120
}: ListingContentLayoutProps) => {
  return (
    <Box
      sx={(theme) => ({
        maxWidth: '1400px',
        mx: 'auto',
        px: 2,
        py: 4,
        [theme.breakpoints.up('sm')]: { px: 3 },
        [theme.breakpoints.up('xl')]: { px: 0 }
      })}
    >
      {breadcrumbs}

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 4,
          mt: 2,
          [theme.breakpoints.up('lgm')]: {
            gridTemplateColumns: `${sidebarWidth}px 1fr`
          }
        })}
      >
        <Box>
          {isTablet && (
            <Button
              variant="contained"
              onClick={onToggleFilters}
              sx={{
                width: '100%',
                mb: 2,
                textTransform: 'none',
                fontSize: { xs: '1rem', sm: '1.05rem' },
                fontWeight: 600,
                py: 1.1
              }}
            >
              {isFiltersOpen ? closeFiltersLabel : openFiltersLabel}
            </Button>
          )}

          {(!isTablet || isFiltersOpen) && (
            <Grow in={isFiltersOpen || !isTablet}>
              <Box
                sx={(theme) => ({
                  position: 'static',
                  [theme.breakpoints.up('lgm')]: {
                    position: 'sticky',
                    top: filtersTopOffset
                  }
                })}
              >
                {filters}
              </Box>
            </Grow>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          {summary}
          {content}
          {pagination}
        </Box>
      </Box>
    </Box>
  );
};
