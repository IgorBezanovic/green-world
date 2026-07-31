'use client';

import { SharedPagination } from '@green-world/components/SharedPagination';
import UserContext from '@green-world/context/UserContext';
import { useAdminOrders } from '@green-world/hooks/useAdminOrders';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  useBuyerOrders,
  useMarkSellerOrdersRead,
  useSellerOrders,
  useUpdateSellerOrderStatus
} from '@green-world/hooks/useSellerOrders';
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Link,
  Paper,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Clock3, Search } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type OrdersViewVariant = 'admin' | 'profile';

type OrdersViewProps = {
  variant: OrdersViewVariant;
};

const formatOrderDate = (value: string, locale?: string) => {
  const date = new Date(value);

  return {
    date: date.toLocaleDateString(locale),
    time: date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

export const OrdersView = ({ variant }: OrdersViewProps) => {
  if (variant === 'admin') {
    return <AdminOrdersContent />;
  }

  return <ProfileOrdersContent />;
};

const AdminOrdersContent = () => {
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

const ProfileOrdersContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isSeller = user?.role === 'seller';
  const [activeTab, setActiveTab] = useState<'ordered' | 'received'>(
    'received'
  );
  const [orderedPage, setOrderedPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);
  const { data: sellerData, isFetching: sellerFetching } = useSellerOrders(
    { page: receivedPage, pageSize: 20 },
    isSeller
  );
  const { data: buyerData, isFetching: buyerFetching } = useBuyerOrders(
    { page: orderedPage, pageSize: 20 },
    true
  );
  const updateSellerStatusMut = useUpdateSellerOrderStatus();
  const markReadMut = useMarkSellerOrdersRead();
  const didMarkRead = useRef(false);
  const [pendingReceivedStatusId, setPendingReceivedStatusId] = useState<
    string | null
  >(null);

  const isReceivedTab = isSeller && activeTab === 'received';

  useEffect(() => {
    if (isReceivedTab && !didMarkRead.current) {
      didMarkRead.current = true;
      markReadMut.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReceivedTab]);

  const data = isReceivedTab ? sellerData : buyerData;
  const isFetching = isReceivedTab ? sellerFetching : buyerFetching;
  const rows = (data?.data ?? []).filter((row) => {
    if (!user?._id) {
      return true;
    }

    if (isReceivedTab) {
      return row.sellerUserId === user._id;
    }

    return row.buyerUserId === user._id;
  });
  const totalPages = data?.meta?.pages ?? 1;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mb: 0.75, fontSize: { xs: '1.6rem', md: '2rem' } }}
        >
          {t('profileOrdersView.mainTitle')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}
        >
          {isReceivedTab
            ? t('profileOrdersView.receivedSubtitle')
            : t('profileOrdersView.orderedSubtitle')}
        </Typography>
      </Box>

      {isSeller && (
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v: 'ordered' | 'received') => setActiveTab(v)}
          >
            <Tab
              value="received"
              label={t('profileOrdersView.tabs.received')}
            />
            <Tab value="ordered" label={t('profileOrdersView.tabs.ordered')} />
          </Tabs>
        </Box>
      )}

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, overflowX: 'auto' }}
      >
        <Table sx={{ minWidth: 1220 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: 'grey.100',
                '& .MuiTableCell-head': { py: 1.75, fontSize: '0.95rem' }
              }}
            >
              <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                {t('profileOrdersView.columns.product')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 90 }}>
                {t('profileOrdersView.columns.quantity')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>
                {isReceivedTab
                  ? t('profileOrdersView.columns.buyer')
                  : t('profileOrdersView.columns.seller')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 230 }}>
                {t('profileOrdersView.columns.contact')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 170 }}>
                {t('profileOrdersView.columns.note')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 210 }}>
                {t('profileOrdersView.columns.address')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 230 }}>
                {t('profileOrdersView.columns.status')}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 165 }}>
                {t('profileOrdersView.columns.date')}
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
                  <TableRow
                    key={row._id}
                    hover
                    sx={{
                      '&:nth-of-type(even)': { bgcolor: 'action.hover' },
                      '& .MuiTableCell-body': {
                        py: 2,
                        verticalAlign: 'top'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.productPrice}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.productQuantity}</TableCell>
                    <TableCell>
                      {isReceivedTab && row.buyerUserId ? (
                        <Link
                          component="button"
                          type="button"
                          onClick={() => navigate(`/shop/${row.buyerUserId}`)}
                          underline="hover"
                          sx={{
                            color: 'text.primary',
                            fontWeight: 700,
                            textAlign: 'left'
                          }}
                        >
                          {`${row.buyerName} ${row.buyerLastName}`}
                        </Link>
                      ) : (
                        <Typography variant="body2" fontWeight={700}>
                          {isReceivedTab
                            ? `${row.buyerName} ${row.buyerLastName}`
                            : row.sellerName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {isReceivedTab ? row.buyerEmail : row.sellerEmail}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isReceivedTab ? row.buyerPhone : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.buyerMessage?.trim() ? row.buyerMessage : '—'}
                    </TableCell>
                    <TableCell>
                      {isReceivedTab ? (
                        <>
                          <Typography variant="body2">
                            {row.buyerAddress}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.buyerCity}, {row.buyerPostalCode}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('profileOrdersView.buyerAddressHint')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.25
                        }}
                      >
                        <Chip
                          size="small"
                          label={
                            isReceivedTab
                              ? row.buyerStatus === 'DELIVERED'
                                ? t('profileOrdersView.status.delivered')
                                : row.buyerStatus === 'SELLER_CONTACTED'
                                  ? t(
                                      'profileOrdersView.status.customerContacted'
                                    )
                                  : row.sellerReadAt
                                    ? t('profileOrdersView.status.seen')
                                    : t('profileOrdersView.status.new')
                              : row.buyerStatus === 'DELIVERED'
                                ? t('profileOrdersView.status.delivered')
                                : row.buyerStatus === 'SELLER_CONTACTED'
                                  ? t(
                                      'profileOrdersView.status.sellerContacted'
                                    )
                                  : row.sellerReadAt
                                    ? t('profileOrdersView.status.inProgress')
                                    : t('profileOrdersView.status.sent')
                          }
                          color={
                            row.buyerStatus === 'DELIVERED'
                              ? 'success'
                              : row.sellerReadAt
                                ? 'default'
                                : 'error'
                          }
                        />
                        {isReceivedTab &&
                          row.sellerReadAt &&
                          row.buyerStatus !== 'DELIVERED' && (
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 1,
                                '& .MuiButton-root': {
                                  whiteSpace: 'nowrap',
                                  px: 1,
                                  minHeight: 36
                                }
                              }}
                            >
                              <Button
                                size="small"
                                variant={
                                  row.buyerStatus === 'SELLER_CONTACTED'
                                    ? 'contained'
                                    : 'outlined'
                                }
                                onClick={() => {
                                  setPendingReceivedStatusId(row._id);
                                  updateSellerStatusMut.mutate(
                                    { id: row._id, status: 'SELLER_CONTACTED' },
                                    {
                                      onSettled: () =>
                                        setPendingReceivedStatusId(null)
                                    }
                                  );
                                }}
                                disabled={pendingReceivedStatusId === row._id}
                              >
                                {t(
                                  'profileOrdersView.actions.customerContacted'
                                )}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                  setPendingReceivedStatusId(row._id);
                                  updateSellerStatusMut.mutate(
                                    { id: row._id, status: 'DELIVERED' },
                                    {
                                      onSettled: () =>
                                        setPendingReceivedStatusId(null)
                                    }
                                  );
                                }}
                                disabled={pendingReceivedStatusId === row._id}
                              >
                                {t('profileOrdersView.actions.delivered')}
                              </Button>
                            </Box>
                          )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'flex-start'
                        }}
                      >
                        <Clock3
                          size={17}
                          style={{ marginTop: 2, flexShrink: 0 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {formatOrderDate(row.createdAt, i18n.language).date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatOrderDate(row.createdAt, i18n.language).time}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {t('profileOrdersView.empty')}
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
            currentPage={isReceivedTab ? receivedPage : orderedPage}
            totalPages={totalPages}
            onPageChange={isReceivedTab ? setReceivedPage : setOrderedPage}
          />
        </Box>
      )}
    </Box>
  );
};
