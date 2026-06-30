'use client';

import { SharedPagination } from '@green-world/components/SharedPagination';
import UserContext from '@green-world/context/UserContext';
import {
  useMarkSellerOrdersRead,
  useSellerOrders
} from '@green-world/hooks/useSellerOrders';
import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';

export const SellerOrdersView = () => {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const { data, isFetching } = useSellerOrders({ page, pageSize: 20 });
  const markReadMut = useMarkSellerOrdersRead();
  const didMarkRead = useRef(false);

  useEffect(() => {
    if (user?.role === 'seller' && !didMarkRead.current) {
      didMarkRead.current = true;
      markReadMut.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.pages ?? 1;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Moje porudzbine
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pregled svih porudžbina za vaše proizvode.
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 700 }}>Proizvod</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Količina</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kupac</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kontakt</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Adresa</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.productPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.productQuantity}</TableCell>
                    <TableCell>{`${row.buyerName} ${row.buyerLastName}`}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.buyerEmail}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.buyerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.buyerAddress}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.buyerCity}, {row.buyerPostalCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.sellerReadAt ? 'Viđeno' : 'Novo'}
                        color={row.sellerReadAt ? 'default' : 'error'}
                      />
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
