'use client';

import { SharedPagination } from '@green-world/components/SharedPagination';
import {
  useAdminApproveVerification,
  useAdminRequestVerificationChange,
  useAdminVerificationFailures
} from '@green-world/hooks/useAdminVerificationFailures';
import { useDebounce } from '@green-world/hooks/useDebounce';
import type { AdminVerificationFailureItem } from '@green-world/services/adminApi';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { Check, ExternalLink, Mail, Search, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

const ENTITY_FILTERS = [
  { value: 'all', label: 'Svi tipovi' },
  { value: 'product', label: 'Proizvodi' },
  { value: 'event', label: 'Događaji' },
  { value: 'service', label: 'Usluge' },
  { value: 'blog', label: 'Blogovi' },
  { value: 'user', label: 'Profili' }
];

const KIND_FILTERS = [
  { value: 'all', label: 'Svi razlozi' },
  { value: 'flagged', label: 'Flagovano' },
  { value: 'error', label: 'Tehnička greška' }
];

const DEFAULT_MESSAGES = {
  sr: 'Molimo Vas da izmenite sadržaj (tekst i/ili slike) kako bi bio u skladu sa pravilima Zelenog Sveta. Nakon izmene, sadržaj će automatski biti ponovo proveren.',
  en: 'Please update your content (text and/or images) so it complies with Zeleni Svet rules. After you save changes, the content will be checked automatically again.',
  ru: 'Пожалуйста, измените контент (текст и/или изображения), чтобы он соответствовал правилам Zeleni Svet. После сохранения изменений контент снова будет проверен автоматически.'
} as const;

type EmailLocale = keyof typeof DEFAULT_MESSAGES;

export const AdminVerificationFailuresView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('all');
  const [kind, setKind] = useState('all');
  const debouncedSearch = useDebounce(search, 300);

  const [requestItem, setRequestItem] =
    useState<AdminVerificationFailureItem | null>(null);
  const [emailLocale, setEmailLocale] = useState<EmailLocale>('sr');
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGES.sr);

  const filters = useMemo(
    () => ({
      page,
      pageSize: 20,
      search: debouncedSearch.trim() || undefined,
      entityType,
      kind
    }),
    [page, debouncedSearch, entityType, kind]
  );

  const { data, isFetching } = useAdminVerificationFailures(filters);
  const { mutate: approve, isPending: isApproving } =
    useAdminApproveVerification();
  const { mutate: requestChange, isPending: isRequesting } =
    useAdminRequestVerificationChange();

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.pages ?? 1;
  const totalItems = data?.meta?.totalItems ?? 0;

  const handleApprove = (row: AdminVerificationFailureItem) => {
    approve({ entityType: row.entityType, id: row._id });
  };

  const handleOpenRequest = (row: AdminVerificationFailureItem) => {
    setRequestItem(row);
    setEmailLocale('sr');
    setMessage(DEFAULT_MESSAGES.sr);
  };

  const handleSendRequest = () => {
    if (!requestItem) return;
    requestChange(
      {
        entityType: requestItem.entityType,
        id: requestItem._id,
        message,
        locale: emailLocale
      },
      {
        onSuccess: () => setRequestItem(null)
      }
    );
  };

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
        <Box>
          <Typography variant="h6" fontWeight={700}>
            AI verifikacija – neuspešni
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalItems} stavki za pregled
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Pretraži…"
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
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Tip</InputLabel>
            <Select
              label="Tip"
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value);
                setPage(1);
              }}
            >
              {ENTITY_FILTERS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Razlog</InputLabel>
            <Select
              label="Razlog"
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                setPage(1);
              }}
            >
              {KIND_FILTERS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tip</TableCell>
              <TableCell>Naslov</TableCell>
              <TableCell>Vlasnik</TableCell>
              <TableCell>Razlog</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && rows.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}

            {!isFetching && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <ShieldAlert size={28} style={{ opacity: 0.4 }} />
                    <Typography color="text.secondary" mt={1}>
                      Nema stavki koje nisu prošle AI verifikaciju.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : null}

            {rows.map((row) => (
              <TableRow key={row.rowId} hover>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.entityTypeLabel}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.title || '—'}
                  </Typography>
                  {row.verificationError ? (
                    <Chip
                      size="small"
                      color="info"
                      label="Tehnička greška"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Chip
                      size="small"
                      color="warning"
                      label="Flagovano"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.owner.name || '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.owner.email || '—'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 320 }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {row.verificationReason || '—'}
                  </Typography>
                  {row.verificationViolations?.length > 0 ? (
                    <Box sx={{ mt: 0.5 }}>
                      {row.verificationViolations.slice(0, 3).map((v) => (
                        <Typography
                          key={v}
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          • {v}
                        </Typography>
                      ))}
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.75,
                      justifyContent: 'flex-end',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={
                        isApproving ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          <Check size={14} />
                        )
                      }
                      disabled={isApproving || isRequesting}
                      onClick={() => handleApprove(row)}
                    >
                      Odobri
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Mail size={14} />}
                      disabled={isApproving || isRequesting || !row.owner.email}
                      onClick={() => handleOpenRequest(row)}
                    >
                      Zahtev za izmenu
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<ExternalLink size={14} />}
                      href={row.entityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Otvori
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 ? (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <SharedPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Box>
      ) : null}

      <Dialog
        open={Boolean(requestItem)}
        onClose={() => !isRequesting && setRequestItem(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Zahtev za izmenu</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Email će biti poslat na{' '}
            <b>{requestItem?.owner.email || 'nepoznato'}</b> za{' '}
            <b>{requestItem?.title}</b>.
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Jezik emaila</InputLabel>
            <Select
              label="Jezik emaila"
              value={emailLocale}
              disabled={isRequesting}
              onChange={(e) => {
                const next = e.target.value as EmailLocale;
                setEmailLocale(next);
                setMessage(DEFAULT_MESSAGES[next]);
              }}
            >
              <MenuItem value="sr">Srpski</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ru">Русский</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Poruka korisniku"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={5}
            disabled={isRequesting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestItem(null)} disabled={isRequesting}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            onClick={handleSendRequest}
            disabled={isRequesting || !message.trim()}
            startIcon={
              isRequesting ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <Mail size={14} />
              )
            }
          >
            Pošalji email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
