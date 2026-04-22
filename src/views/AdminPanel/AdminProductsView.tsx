'use client';

import { AdminImageManager } from '@green-world/components/AdminImageManager/AdminImageManager';
import { AdminTable } from '@green-world/components/AdminTable';
import { DeleteConfirmDialog } from '@green-world/components/DeleteConfirmDialog';
import {
  useAdminCreateProduct,
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminUpdateProduct,
  useAdminUsersList
} from '@green-world/hooks/useAdminProducts';
import { useDebounce } from '@green-world/hooks/useDebounce';
import type { AdminProductItem } from '@green-world/services/adminApi';
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
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

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
  .ql-editor {
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

// ─── Constants ──────────────────────────────────────────────────────────────

const PRODUCT_GROUPS = [
  'flower_assortment',
  'succulents',
  'potted_flowers',
  'seedlings',
  'fruits_and_vegetables',
  'herbal_pharmacy',
  'garden_decoration',
  'everything_for_plants',
  'equipment_and_tools',
  'urban_gardening',
  'seeds_and_bulbs',
  'eco_and_organic'
];

const PRODUCT_STATUSES = ['readyForReview', 'active', 'nonActive', 'deleted'];

// ─── Empty form ──────────────────────────────────────────────────────────────

const emptyForm = {
  createdBy: '',
  group: '',
  subGroup: '',
  title: '',
  description: '',
  shortDescription: '',
  price: '',
  priceOnRequest: false,
  status: 'active',
  onStock: true,
  images: [] as string[],
  height: '',
  weight: '',
  width: '',
  milliliters: '',
  viewCounter: '',
  promotedAt: '',
  promotedUntil: '',
  verified: false,
  verifiedDone: false
};

// ─── Component ───────────────────────────────────────────────────────────────

export const AdminProductsView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchValue = debouncedSearch.trim();
  const searchById = /^[a-f\d]{24}$/i.test(searchValue);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(
    null
  );
  const [form, setForm] = useState(emptyForm);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries & mutations
  const { data, isFetching } = useAdminProducts({
    id: searchById ? searchValue : undefined,
    title: searchById ? undefined : searchValue || undefined,
    page,
    pageSize: 20
  });
  const { data: usersData } = useAdminUsersList();
  const createMut = useAdminCreateProduct();
  const updateMut = useAdminUpdateProduct();
  const deleteMut = useAdminDeleteProduct();

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setForm({
        createdBy: (editingProduct.createdBy as any)?._id ?? '',
        group: editingProduct.group ?? '',
        subGroup: editingProduct.subGroup ?? '',
        title: editingProduct.title ?? '',
        description: (editingProduct as any).description ?? '',
        shortDescription: (editingProduct as any).shortDescription ?? '',
        price: editingProduct.price != null ? String(editingProduct.price) : '',
        priceOnRequest: editingProduct.priceOnRequest ?? false,
        status: editingProduct.status ?? 'active',
        onStock: editingProduct.onStock ?? true,
        images: editingProduct.images ?? [],
        height: (editingProduct as any).height ?? '',
        weight: (editingProduct as any).weight ?? '',
        width: (editingProduct as any).width ?? '',
        milliliters: (editingProduct as any).milliliters ?? '',
        viewCounter:
          (editingProduct as any).viewCounter != null
            ? String((editingProduct as any).viewCounter)
            : '',
        promotedAt: (editingProduct as any).promotedAt
          ? new Date((editingProduct as any).promotedAt)
              .toISOString()
              .slice(0, 16)
          : '',
        promotedUntil: (editingProduct as any).promotedUntil
          ? new Date((editingProduct as any).promotedUntil)
              .toISOString()
              .slice(0, 16)
          : '',
        verified: (editingProduct as any).verified ?? false,
        verifiedDone: (editingProduct as any).verifiedDone ?? false
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: AdminProductItem) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      images: form.images,
      price: form.priceOnRequest ? null : Number(form.price) || null,
      viewCounter:
        form.viewCounter !== '' ? Number(form.viewCounter) : undefined,
      promotedAt: form.promotedAt || null,
      promotedUntil: form.promotedUntil || null
    };

    if (editingProduct) {
      updateMut.mutate(
        { id: editingProduct._id, data: payload },
        { onSuccess: handleClose }
      );
    } else {
      createMut.mutate(payload, { onSuccess: handleClose });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns = [
    { key: 'title', label: 'Naziv' },
    { key: 'group', label: 'Grupa' },
    {
      key: 'createdBy',
      label: 'Korisnik',
      render: (row: AdminProductItem) =>
        typeof row.createdBy === 'object' ? row.createdBy.name : '—'
    },
    {
      key: 'price',
      label: 'Cena',
      render: (row: AdminProductItem) =>
        row.priceOnRequest
          ? 'Na upit'
          : row.price != null
            ? `${row.price} RSD`
            : '—'
    },
    { key: 'status', label: 'Status' },
    {
      key: 'editedByAdmin',
      label: 'Admin izmena',
      render: (row: AdminProductItem) => (row.editedByAdmin ? '✓' : '')
    }
  ];

  const isSaving = createMut.isPending || updateMut.isPending;

  return (
    <Box>
      <AdminTable
        title="Proizvodi"
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
        onEdit={openEdit}
        onDelete={setDeleteId}
        onCreate={openCreate}
        createLabel="Dodaj proizvod"
      />

      {/* ── Create / Edit dialog ──────────────────────────────── */}
      <Dialog open={formOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Izmeni proizvod' : 'Novi proizvod'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* User selector – only shown when creating */}
            {!editingProduct && (
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

            <FormControl fullWidth size="small" required>
              <InputLabel>Grupa</InputLabel>
              <Select
                value={form.group}
                label="Grupa"
                onChange={(e) =>
                  setForm((f) => ({ ...f, group: e.target.value }))
                }
              >
                {PRODUCT_GROUPS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Podgrupa"
              size="small"
              required
              fullWidth
              value={form.subGroup}
              onChange={(e) =>
                setForm((f) => ({ ...f, subGroup: e.target.value }))
              }
            />

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

            <TextField
              label="Kratak opis"
              size="small"
              fullWidth
              value={form.shortDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescription: e.target.value }))
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

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.priceOnRequest}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceOnRequest: e.target.checked }))
                  }
                />
              }
              label="Cena na upit"
            />

            {!form.priceOnRequest && (
              <TextField
                label="Cena (RSD)"
                size="small"
                type="number"
                fullWidth
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
            )}

            <AdminImageManager
              images={form.images}
              onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
              maxImages={10}
            />

            <Divider />
            <Typography variant="caption" color="text.secondary">
              Dimenzije i mere
            </Typography>

            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Visina"
                size="small"
                fullWidth
                value={form.height}
                onChange={(e) =>
                  setForm((f) => ({ ...f, height: e.target.value }))
                }
              />
              <TextField
                label="Težina"
                size="small"
                fullWidth
                value={form.weight}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weight: e.target.value }))
                }
              />
              <TextField
                label="Širina"
                size="small"
                fullWidth
                value={form.width}
                onChange={(e) =>
                  setForm((f) => ({ ...f, width: e.target.value }))
                }
              />
              <TextField
                label="Mililitri"
                size="small"
                fullWidth
                value={form.milliliters}
                onChange={(e) =>
                  setForm((f) => ({ ...f, milliliters: e.target.value }))
                }
              />
            </Box>

            <Divider />
            <Typography variant="caption" color="text.secondary">
              Status i vidljivost
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                {PRODUCT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.onStock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, onStock: e.target.checked }))
                    }
                  />
                }
                label="Na stanju"
              />
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

            <Divider />
            <Typography variant="caption" color="text.secondary">
              Promocija
            </Typography>

            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Promovisan od"
                size="small"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.promotedAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, promotedAt: e.target.value }))
                }
              />
              <TextField
                label="Promovisan do"
                size="small"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.promotedUntil}
                onChange={(e) =>
                  setForm((f) => ({ ...f, promotedUntil: e.target.value }))
                }
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
            onClick={handleSubmit}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={14} /> : null}
          >
            {editingProduct ? 'Sačuvaj izmene' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete confirmation ──────────────────────────────── */}
      <DeleteConfirmDialog
        open={!!deleteId}
        title="Obriši proizvod"
        description="Da li ste sigurni da želite da obrišete ovaj proizvod? Ova akcija je nepovratna."
        cancelText="Otkaži"
        confirmText="Obriši"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMut.isPending}
      />
    </Box>
  );
};
