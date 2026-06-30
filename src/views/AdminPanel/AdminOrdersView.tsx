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

export const AdminOrdersView = () => {
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
          Porudzbine
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minWidth: 300 }}>
          <TextField
            size="small"
            placeholder="Pretraga (proizvod, kupac, email...)"
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
              <TableCell sx={{ fontWeight: 700 }}>Proizvod</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kolicina</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cena</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kupac</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email/Telefon</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Prodavac</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Datum</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 7 }).map((__, cellIdx) => (
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
                      <Typography variant="body2">
                        {row.sellerName || '—'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.sellerEmail || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleString('sr-RS')}
                    </TableCell>
                  </TableRow>
                ))}

            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nema porudzbina
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
