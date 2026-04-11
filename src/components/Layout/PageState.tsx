import {
  Box,
  CircularProgress,
  type BoxProps,
  type SxProps,
  type Theme
} from '@mui/material';

export const APP_PAGE_MIN_HEIGHT = 'calc(100vh - 360px)';

const PAGE_CONTENT_SX = {
  width: '100%',
  backgroundColor: 'background.paper',
  minHeight: APP_PAGE_MIN_HEIGHT
};

const normalizeSx = (sx?: SxProps<Theme>) => {
  if (!sx) {
    return [] as SxProps<Theme>[];
  }

  return Array.isArray(sx) ? sx : [sx];
};

export const PageContent = ({ children, sx, ...rest }: BoxProps) => {
  return (
    <Box {...rest} sx={[PAGE_CONTENT_SX, ...normalizeSx(sx)]}>
      {children}
    </Box>
  );
};

type PageCenteredStateProps = BoxProps & {
  minHeight?: number | string;
};

export const PageCenteredState = ({
  children,
  minHeight = APP_PAGE_MIN_HEIGHT,
  sx,
  ...rest
}: PageCenteredStateProps) => {
  return (
    <PageContent
      {...rest}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
          minHeight
        },
        ...normalizeSx(sx)
      ]}
    >
      {children}
    </PageContent>
  );
};

type PageLoaderProps = {
  size?: number;
  sx?: SxProps<Theme>;
  minHeight?: number | string;
};

export const PageLoader = ({ size = 40, sx, minHeight }: PageLoaderProps) => {
  return (
    <PageCenteredState minHeight={minHeight} sx={sx}>
      <CircularProgress color="success" size={size} />
    </PageCenteredState>
  );
};
