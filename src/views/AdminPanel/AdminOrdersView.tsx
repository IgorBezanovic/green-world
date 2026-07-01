'use client';

import { SharedPagination } from '@green-world/components/SharedPagination';
import { useAdminOrders } from '@green-world/hooks/useAdminOrders';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  Box,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AdminOrdersView = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300).trim();

  const { data, isFetching } = useAdminOrders({
    q: debouncedSearch || undefined,
    page,
    pageSize: 20
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.pages ?? 1;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {t('adminOrdersView.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minWidth: 300 }}>
          <TextField
            size="small"
            placeholder={t('adminOrdersView.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              )
            }}
            fullWidth
          />
        </Box>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.product')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.quantity')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.price')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.buyer')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.contact')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.note')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.seller')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                {t('adminOrdersView.columns.date')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 8 }).map((__, cellIdx) => (
                      <TableCell key={cellIdx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={row.productName}
                      >
                        {row.productName}
                      </Typography>
                    </TableCell>

                    <TableCell>{row.productQuantity}</TableCell>
                    <TableCell>{row.productPrice}</TableCell>
                    <TableCell>{`${row.buyerName} ${row.buyerLastName}`}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.buyerEmail}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.buyerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.buyerMessage?.trim() ? row.buyerMessage : '—'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.sellerName || '—'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.sellerEmail || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.sellerPhone || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleString('sr-RS')}
                    </TableCell>
                  </TableRow>
                ))}

            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {t('adminOrdersView.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <SharedPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Box>
      )}
    </Box>
  );
};
