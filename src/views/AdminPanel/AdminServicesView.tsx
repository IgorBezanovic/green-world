'use client';

import { AdminImageManager } from '@green-world/components/AdminImageManager/AdminImageManager';
import { AdminTable } from '@green-world/components/AdminTable';
import { DeleteConfirmDialog } from '@green-world/components/DeleteConfirmDialog';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  adminCreateService,
  adminDeleteService,
  adminGetServices,
  adminGetUsersList,
  adminUpdateService,
  type AdminServiceItem
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
  providerId: '',
  title: '',
  description: '',
  services: '',
  images: [] as string[],
  portfolioLinks: '',
  priceType: 'negotiable',
  priceFrom: '',
  priceTo: '',
  location: '',
  serviceRadiusKm: '',
  experienceYears: '',
  equipment: '',
  languages: '',
  availability: '',
  videoUrl: '',
  viewCounter: '',
  verified: false,
  verifiedDone: false,
  status: 'active'
};

export const AdminServicesView = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchValue = debouncedSearch.trim();
  const searchById = OBJECT_ID_REGEX.test(searchValue);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminServiceItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ['adminServices', { searchValue, page }],
    queryFn: () =>
      adminGetServices({
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
    mutationFn: adminCreateService,
    onSuccess: () => {
      toast.success('Usluga kreirana');
      qc.invalidateQueries({ queryKey: ['adminServices'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminUpdateService(id, data),
    onSuccess: () => {
      toast.success('Usluga ažurirana');
      qc.invalidateQueries({ queryKey: ['adminServices'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteService,
    onSuccess: () => {
      toast.success('Usluga obrisana');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminServices'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  useEffect(() => {
    if (editing) {
      const s = editing as any;
      setForm({
        providerId: s.providerId?._id ?? s.providerId ?? '',
        title: s.title ?? '',
        description: s.description ?? '',
        services: Array.isArray(s.services) ? s.services.join(', ') : '',
        images: Array.isArray(s.images) ? s.images : [],
        portfolioLinks: Array.isArray(s.portfolioLinks)
          ? JSON.stringify(s.portfolioLinks)
          : '',
        priceType: s.priceType ?? 'negotiable',
        priceFrom: s.priceFrom != null ? String(s.priceFrom) : '',
        priceTo: s.priceTo != null ? String(s.priceTo) : '',
        location: s.location ?? '',
        serviceRadiusKm:
          s.serviceRadiusKm != null ? String(s.serviceRadiusKm) : '',
        experienceYears:
          s.experienceYears != null ? String(s.experienceYears) : '',
        equipment: Array.isArray(s.equipment) ? s.equipment.join(', ') : '',
        languages: Array.isArray(s.languages) ? s.languages.join(', ') : '',
        availability: Array.isArray(s.availability)
          ? s.availability.join(', ')
          : '',
        videoUrl: s.videoUrl ?? '',
        viewCounter: s.viewCounter != null ? String(s.viewCounter) : '',
        verified: s.verified ?? false,
        verifiedDone: s.verifiedDone ?? false,
        status: s.status ?? 'active'
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
      key: 'providerId',
      label: 'Korisnik',
      render: (r: AdminServiceItem) => {
        const p = (r as any).providerId;
        return p && typeof p === 'object' ? p.name : '—';
      }
    },
    {
      key: 'createdAt',
      label: 'Datum',
      render: (r: AdminServiceItem) =>
        new Date(r.createdAt).toLocaleDateString('sr-RS')
    }
  ];

  return (
    <Box>
      <AdminTable
        title="Usluge"
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
        createLabel="Dodaj uslugu"
      />

      <Dialog open={formOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>{editing ? 'Izmeni uslugu' : 'Nova usluga'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Divider>
              <Typography variant="caption">Osnovni podaci</Typography>
            </Divider>
            {!editing && (
              <FormControl fullWidth size="small" required>
                <InputLabel>Korisnik (provajder)</InputLabel>
                <Select
                  value={form.providerId}
                  label="Korisnik (provajder)"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, providerId: e.target.value }))
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
            <TextField
              label="Video URL"
              size="small"
              fullWidth
              value={form.videoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoUrl: e.target.value }))
              }
            />

            <Divider>
              <Typography variant="caption">Usluge i slike</Typography>
            </Divider>
            <TextField
              label="Usluge (zareza razdvojene)"
              size="small"
              fullWidth
              value={form.services}
              onChange={(e) =>
                setForm((f) => ({ ...f, services: e.target.value }))
              }
            />
            <AdminImageManager
              images={form.images}
              onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
              maxImages={10}
            />
            <TextField
              label="Portfolio linkovi (JSON niz)"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={form.portfolioLinks}
              onChange={(e) =>
                setForm((f) => ({ ...f, portfolioLinks: e.target.value }))
              }
              helperText='Primer: [{"label":"Sajt","url":"https://..."}]'
            />

            <Divider>
              <Typography variant="caption">Cene i lokacija</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Tip cene</InputLabel>
                <Select
                  value={form.priceType}
                  label="Tip cene"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceType: e.target.value }))
                  }
                >
                  <MenuItem value="hourly">hourly</MenuItem>
                  <MenuItem value="fixed">fixed</MenuItem>
                  <MenuItem value="negotiable">negotiable</MenuItem>
                  <MenuItem value="per_m2">per_m2</MenuItem>
                  <MenuItem value="per_tree">per_tree</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Lokacija"
                size="small"
                fullWidth
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
              <TextField
                label="Cena od"
                size="small"
                type="number"
                fullWidth
                value={form.priceFrom}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceFrom: e.target.value }))
                }
              />
              <TextField
                label="Cena do"
                size="small"
                type="number"
                fullWidth
                value={form.priceTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceTo: e.target.value }))
                }
              />
              <TextField
                label="Radijus usluge (km)"
                size="small"
                type="number"
                fullWidth
                value={form.serviceRadiusKm}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serviceRadiusKm: e.target.value }))
                }
              />
              <TextField
                label="Godine iskustva"
                size="small"
                type="number"
                fullWidth
                value={form.experienceYears}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experienceYears: e.target.value }))
                }
              />
            </Box>

            <Divider>
              <Typography variant="caption">Oprema i dostupnost</Typography>
            </Divider>
            <TextField
              label="Oprema (zareza razdvojena)"
              size="small"
              fullWidth
              value={form.equipment}
              onChange={(e) =>
                setForm((f) => ({ ...f, equipment: e.target.value }))
              }
            />
            <TextField
              label="Jezici (zareza razdvojeni)"
              size="small"
              fullWidth
              value={form.languages}
              onChange={(e) =>
                setForm((f) => ({ ...f, languages: e.target.value }))
              }
            />
            <TextField
              label="Dostupnost (zareza razdvojena)"
              size="small"
              fullWidth
              value={form.availability}
              onChange={(e) =>
                setForm((f) => ({ ...f, availability: e.target.value }))
              }
            />

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
                  <MenuItem value="deleted">deleted</MenuItem>
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
              const splitArr = (v: string) =>
                v
                  ? v
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [];
              let portfolioLinks;
              try {
                portfolioLinks = form.portfolioLinks
                  ? JSON.parse(form.portfolioLinks)
                  : [];
              } catch {
                portfolioLinks = [];
              }
              const payload = {
                ...form,
                services: splitArr(form.services),
                images: form.images,
                equipment: splitArr(form.equipment),
                languages: splitArr(form.languages),
                availability: splitArr(form.availability),
                portfolioLinks,
                priceFrom:
                  form.priceFrom !== '' ? Number(form.priceFrom) : undefined,
                priceTo: form.priceTo !== '' ? Number(form.priceTo) : undefined,
                serviceRadiusKm:
                  form.serviceRadiusKm !== ''
                    ? Number(form.serviceRadiusKm)
                    : undefined,
                experienceYears:
                  form.experienceYears !== ''
                    ? Number(form.experienceYears)
                    : undefined,
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
        title="Obriši uslugu"
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
