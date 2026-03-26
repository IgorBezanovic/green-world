import { Box, Pagination } from '@mui/material';

type SharedPaginationProps = {
  totalPages?: number;
  currentPage?: number;
  isLoading?: boolean;
  isError?: boolean;
  isMobile?: boolean;
  marginTop?: number;
  onPageChange: (page: number) => void;
};

export const SharedPagination = ({
  totalPages = 1,
  currentPage = 1,
  isLoading = false,
  isError = false,
  isMobile = false,
  marginTop = 5,
  onPageChange
}: SharedPaginationProps) => {
  if (isLoading || isError || totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: marginTop
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        variant="outlined"
        shape="rounded"
        size={isMobile ? 'medium' : 'large'}
        siblingCount={1}
        boundaryCount={isMobile ? 1 : 2}
      />
    </Box>
  );
};
