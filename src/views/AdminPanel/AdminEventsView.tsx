'use client';

import { AdminImageManager } from '@green-world/components/AdminImageManager/AdminImageManager';
import { AdminTable } from '@green-world/components/AdminTable';
import { DeleteConfirmDialog } from '@green-world/components/DeleteConfirmDialog';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  adminCreateEvent,
  adminDeleteEvent,
  adminGetEvents,
  adminGetUsersList,
  adminUpdateEvent,
  type AdminEventItem
} from '@green-world/services/adminApi';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
  toolbar: [
    { header: [false, '1', '2', '3', '4', '5', '6'] },
    { font: [] },
    { color: [] },
    { background: [] },
    { list: 'ordered' },
    { list: 'bullet' },
    { align: [] },
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'image',
    'video',
    'blockquote'
  ]
};

const quillStyle = `
  .ql-toolbar.ql-snow {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    box-shadow: 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    border-color: rgb(38 96 65) !important;
  }
  .ql-container {
    min-height: 200px !important;
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    border-color: rgb(38 96 65) !important;
  }
  .ql-editor { word-break: break-word; overflow-wrap: break-word; }
`;

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const emptyForm = {
  createdBy: '',
  title: '',
  description: '',
  coverImage: [] as string[],
  place: '',
  address: '',
  dateAction: '',
  startTime: '',
  endTime: '',
  typeAction: 'cleaning',
  contactPerson: '',
  contactPhone: '',
  contactMail: '',
  status: 'active',
  viewCounter: '',
  verified: false,
  verifiedDone: false
};

export const AdminEventsView = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchValue = debouncedSearch.trim();
  const searchById = OBJECT_ID_REGEX.test(searchValue);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminEventItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ['adminEvents', { searchValue, page }],
    queryFn: () =>
      adminGetEvents({
        id: searchById ? searchValue : undefined,
        title: searchById ? undefined : searchValue || undefined,
        page,
        pageSize: 20
      }),
    placeholderData: keepPreviousData
  });

  const { data: usersData } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: adminGetUsersList,
    staleTime: 1000 * 60 * 5
  });

  const createMut = useMutation({
    mutationFn: adminCreateEvent,
    onSuccess: () => {
      toast.success('Događaj kreiran');
      qc.invalidateQueries({ queryKey: ['adminEvents'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminUpdateEvent(id, data),
    onSuccess: () => {
      toast.success('Događaj ažuriran');
      qc.invalidateQueries({ queryKey: ['adminEvents'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteEvent,
    onSuccess: () => {
      toast.success('Događaj obrisan');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminEvents'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  useEffect(() => {
    if (editing) {
      const e = editing as any;
      setForm({
        createdBy: e.createdBy?._id ?? '',
        title: e.title ?? '',
        description: e.description ?? '',
        coverImage: e.coverImage ? [e.coverImage] : [],
        place: e.place ?? '',
        address: e.address ?? '',
        dateAction: e.dateAction
          ? new Date(e.dateAction).toISOString().slice(0, 10)
          : '',
        startTime: e.startTime ?? '',
        endTime: e.endTime ?? '',
        typeAction: e.typeAction ?? 'cleaning',
        contactPerson: e.contactPerson ?? '',
        contactPhone: e.contactPhone ?? '',
        contactMail: e.contactMail ?? '',
        status: e.status ?? 'active',
        viewCounter: e.viewCounter != null ? String(e.viewCounter) : '',
        verified: e.verified ?? false,
        verifiedDone: e.verifiedDone ?? false
      });
    } else setForm(emptyForm);
  }, [editing]);

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };
  const isSaving = createMut.isPending || updateMut.isPending;

  const columns = [
    { key: 'title', label: 'Naziv' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdBy',
      label: 'Korisnik',
      render: (r: AdminEventItem) =>
        typeof r.createdBy === 'object' ? r.createdBy.name : '—'
    },
    {
      key: 'createdAt',
      label: 'Datum',
      render: (r: AdminEventItem) =>
        new Date(r.createdAt).toLocaleDateString('sr-RS')
    }
  ];

  return (
    <Box>
      <AdminTable
        title="Događaji"
        columns={columns}
        rows={data?.data ?? []}
        totalPages={data?.meta?.pages ?? 1}
        currentPage={page}
        isLoading={isFetching}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onPageChange={setPage}
        onEdit={(r) => {
          setEditing(r);
          setFormOpen(true);
        }}
        onDelete={setDeleteId}
        onCreate={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        createLabel="Dodaj događaj"
      />

      <Dialog open={formOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>{editing ? 'Izmeni događaj' : 'Novi događaj'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Divider>
              <Typography variant="caption">Osnovni podaci</Typography>
            </Divider>
            {!editing && (
              <FormControl fullWidth size="small" required>
                <InputLabel>Korisnik</InputLabel>
                <Select
                  value={form.createdBy}
                  label="Korisnik"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, createdBy: e.target.value }))
                  }
                >
                  {(usersData ?? []).map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.name} — {u.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Naziv"
              size="small"
              required
              fullWidth
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <Box sx={{ mb: 1 }}>
              <ReactQuill
                modules={quillModules}
                value={form.description}
                onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                theme="snow"
                style={{ minHeight: 200 }}
              />
              <style>{quillStyle}</style>
            </Box>
            <AdminImageManager
              images={form.coverImage}
              onChange={(imgs) => setForm((f) => ({ ...f, coverImage: imgs }))}
              maxImages={1}
            />

            <Divider>
              <Typography variant="caption">Vreme i lokacija</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Mesto"
                size="small"
                fullWidth
                value={form.place}
                onChange={(e) =>
                  setForm((f) => ({ ...f, place: e.target.value }))
                }
              />
              <TextField
                label="Adresa"
                size="small"
                fullWidth
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
              />
              <TextField
                label="Datum"
                size="small"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.dateAction}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateAction: e.target.value }))
                }
              />
              <FormControl fullWidth size="small">
                <InputLabel>Tip događaja</InputLabel>
                <Select
                  value={form.typeAction}
                  label="Tip događaja"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, typeAction: e.target.value }))
                  }
                >
                  <MenuItem value="cleaning">cleaning</MenuItem>
                  <MenuItem value="selling">selling</MenuItem>
                  <MenuItem value="planting">planting</MenuItem>
                  <MenuItem value="education">education</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Početak (vreme)"
                size="small"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
              />
              <TextField
                label="Kraj (vreme)"
                size="small"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
              />
            </Box>

            <Divider>
              <Typography variant="caption">Kontakt</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Kontakt osoba"
                size="small"
                fullWidth
                value={form.contactPerson}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPerson: e.target.value }))
                }
              />
              <TextField
                label="Kontakt telefon"
                size="small"
                fullWidth
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPhone: e.target.value }))
                }
              />
              <TextField
                label="Kontakt email"
                size="small"
                type="email"
                fullWidth
                value={form.contactMail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactMail: e.target.value }))
                }
              />
            </Box>

            <Divider>
              <Typography variant="caption">Status i statistike</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  label="Status"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="cancelled">cancelled</MenuItem>
                  <MenuItem value="finished">finished</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Broj pregleda"
                size="small"
                type="number"
                fullWidth
                value={form.viewCounter}
                onChange={(e) =>
                  setForm((f) => ({ ...f, viewCounter: e.target.value }))
                }
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.verified}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, verified: e.target.checked }))
                    }
                  />
                }
                label="Verifikovan"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.verifiedDone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, verifiedDone: e.target.checked }))
                    }
                  />
                }
                label="Verifikacija završena"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSaving}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={14} /> : null}
            onClick={() => {
              const payload = {
                ...form,
                coverImage: form.coverImage[0] ?? '',
                viewCounter:
                  form.viewCounter !== '' ? Number(form.viewCounter) : undefined
              };
              editing
                ? updateMut.mutate({ id: editing._id, data: payload })
                : createMut.mutate(payload);
            }}
          >
            {editing ? 'Sačuvaj' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteId}
        title="Obriši događaj"
        description="Da li ste sigurni?"
        cancelText="Otkaži"
        confirmText="Obriši"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMut.mutate(deleteId)}
        isLoading={deleteMut.isPending}
      />
    </Box>
  );
};
