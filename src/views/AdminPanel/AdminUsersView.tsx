'use client';

import { AdminTable } from '@green-world/components/AdminTable';
import { DeleteConfirmDialog } from '@green-world/components/DeleteConfirmDialog';
import {
  useAdminCreateUser,
  useAdminDeleteUser,
  useAdminUpdateUser,
  useAdminUsers
} from '@green-world/hooks/useAdminUsers';
import { useDebounce } from '@green-world/hooks/useDebounce';
import type { AdminUserPreview } from '@green-world/services/adminApi';
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
import { useEffect, useState } from 'react';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Ponedeljak',
  tuesday: 'Utorak',
  wednesday: 'Sreda',
  thursday: 'Četvrtak',
  friday: 'Petak',
  saturday: 'Subota',
  sunday: 'Nedelja'
};

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const emptyWorkingDay = { open: '', close: '', isClosed: false };
const emptyWorkingTime = Object.fromEntries(
  DAYS.map((d) => [d, { ...emptyWorkingDay }])
);

const emptyForm = {
  name: '',
  lastname: '',
  email: '',
  password: '',
  role: 'seller' as 'admin' | 'seller',
  shopName: '',
  phone: '',
  shopDescription: '',
  website: '',
  profileImage: '',
  coverImage: '',
  onlyOnline: false,
  onlyOnThisSite: false,
  verified: false,
  verifiedDone: false,
  maxShopProducts: '25',
  numberOfProducts: '',
  numberOfActions: '',
  numberOfBlogs: '',
  shopPromotedAt: '',
  shopPromotedUntil: '',
  address: { street: '', zipCode: '', city: '', country: '' },
  socialMedia: { instagram: '', facebook: '', tiktok: '', linkedin: '' },
  workingTime: emptyWorkingTime as any
};

export const AdminUsersView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchValue = debouncedSearch.trim();
  const searchById = OBJECT_ID_REGEX.test(searchValue);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserPreview | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isFetching } = useAdminUsers({
    id: searchById ? searchValue : undefined,
    name: searchById ? undefined : searchValue || undefined,
    page,
    pageSize: 20
  });
  const createMut = useAdminCreateUser();
  const updateMut = useAdminUpdateUser();
  const deleteMut = useAdminDeleteUser();

  const toDatetimeLocal = (v: any) =>
    v ? new Date(v).toISOString().slice(0, 16) : '';

  useEffect(() => {
    if (editingUser) {
      const u = editingUser as any;
      setForm({
        name: u.name ?? '',
        lastname: u.lastname ?? '',
        email: u.email ?? '',
        password: '',
        role: u.role ?? 'seller',
        shopName: u.shopName ?? '',
        phone: u.phone ?? '',
        shopDescription: u.shopDescription ?? '',
        website: u.website ?? '',
        profileImage: u.profileImage ?? '',
        coverImage: u.coverImage ?? '',
        onlyOnline: u.onlyOnline ?? false,
        onlyOnThisSite: u.onlyOnThisSite ?? false,
        verified: u.verified ?? false,
        verifiedDone: u.verifiedDone ?? false,
        maxShopProducts:
          u.maxShopProducts != null ? String(u.maxShopProducts) : '25',
        numberOfProducts:
          u.numberOfProducts != null ? String(u.numberOfProducts) : '',
        numberOfActions:
          u.numberOfActions != null ? String(u.numberOfActions) : '',
        numberOfBlogs: u.numberOfBlogs != null ? String(u.numberOfBlogs) : '',
        shopPromotedAt: toDatetimeLocal(u.shopPromotedAt),
        shopPromotedUntil: toDatetimeLocal(u.shopPromotedUntil),
        address: {
          street: u.address?.street ?? '',
          zipCode: u.address?.zipCode != null ? String(u.address.zipCode) : '',
          city: u.address?.city ?? '',
          country: u.address?.country ?? ''
        },
        socialMedia: {
          instagram: u.socialMedia?.instagram ?? '',
          facebook: u.socialMedia?.facebook ?? '',
          tiktok: u.socialMedia?.tiktok ?? '',
          linkedin: u.socialMedia?.linkedin ?? ''
        },
        workingTime: DAYS.reduce(
          (acc, d) => ({
            ...acc,
            [d]: {
              open: u.workingTime?.[d]?.open ?? '',
              close: u.workingTime?.[d]?.close ?? '',
              isClosed: u.workingTime?.[d]?.isClosed ?? false
            }
          }),
          {} as any
        )
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingUser]);

  const handleClose = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      maxShopProducts:
        form.maxShopProducts !== '' ? Number(form.maxShopProducts) : undefined,
      numberOfProducts:
        form.numberOfProducts !== ''
          ? Number(form.numberOfProducts)
          : undefined,
      numberOfActions:
        form.numberOfActions !== '' ? Number(form.numberOfActions) : undefined,
      numberOfBlogs:
        form.numberOfBlogs !== '' ? Number(form.numberOfBlogs) : undefined,
      address: {
        ...form.address,
        zipCode:
          form.address.zipCode !== '' ? Number(form.address.zipCode) : undefined
      },
      shopPromotedAt: form.shopPromotedAt || null,
      shopPromotedUntil: form.shopPromotedUntil || null
    };

    if (editingUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, email: _em, ...rest } = payload;
      updateMut.mutate(
        { id: editingUser._id, data: rest },
        { onSuccess: handleClose }
      );
    } else {
      createMut.mutate(payload, { onSuccess: handleClose });
    }
  };

  const isSaving = createMut.isPending || updateMut.isPending;

  const setDay = (day: string, field: string, value: any) =>
    setForm((f) => ({
      ...f,
      workingTime: {
        ...f.workingTime,
        [day]: { ...f.workingTime[day], [field]: value }
      }
    }));

  const columns = [
    { key: 'name', label: 'Ime' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Uloga',
      render: (row: AdminUserPreview) => (
        <Chip
          size="small"
          label={row.role}
          color={row.role === 'admin' ? 'error' : 'default'}
        />
      )
    },
    {
      key: 'verified',
      label: 'Verifikovan',
      render: (row: AdminUserPreview) =>
        row.verified ? (
          <Chip size="small" label="Da" color="success" />
        ) : (
          <Chip size="small" label="Ne" />
        )
    },
    {
      key: 'createdAt',
      label: 'Datum',
      render: (row: AdminUserPreview) =>
        new Date(row.createdAt).toLocaleDateString('sr-RS')
    }
  ];

  return (
    <Box>
      <AdminTable
        title="Korisnici"
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
        onEdit={(u) => {
          setEditingUser(u);
          setFormOpen(true);
        }}
        onDelete={setDeleteId}
        onCreate={() => {
          setEditingUser(null);
          setFormOpen(true);
        }}
        createLabel="Dodaj korisnika"
      />

      <Dialog open={formOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          {editingUser ? 'Izmeni korisnika' : 'Novi korisnik'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* ── Osnovni podaci ── */}
            <Divider>
              <Typography variant="caption">Osnovni podaci</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Ime"
                size="small"
                required
                fullWidth
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <TextField
                label="Prezime"
                size="small"
                fullWidth
                value={form.lastname}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastname: e.target.value }))
                }
              />
            </Box>
            {!editingUser && (
              <Box
                sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
              >
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  required
                  fullWidth
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                <TextField
                  label="Lozinka"
                  type="password"
                  size="small"
                  required
                  fullWidth
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </Box>
            )}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Uloga</InputLabel>
                <Select
                  value={form.role}
                  label="Uloga"
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as 'admin' | 'seller'
                    }))
                  }
                >
                  <MenuItem value="seller">seller</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Telefon"
                size="small"
                fullWidth
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </Box>

            {/* ── Prodavnica ── */}
            <Divider>
              <Typography variant="caption">Prodavnica</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Naziv prodavnice"
                size="small"
                fullWidth
                value={form.shopName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shopName: e.target.value }))
                }
              />
              <TextField
                label="Vebsajt"
                size="small"
                fullWidth
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
              />
            </Box>
            <TextField
              label="Opis prodavnice"
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={form.shopDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, shopDescription: e.target.value }))
              }
            />
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Profilna slika (URL)"
                size="small"
                fullWidth
                value={form.profileImage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, profileImage: e.target.value }))
                }
              />
              <TextField
                label="Cover slika (URL)"
                size="small"
                fullWidth
                value={form.coverImage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, coverImage: e.target.value }))
                }
              />
            </Box>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Maks. proizvoda"
                size="small"
                type="number"
                fullWidth
                value={form.maxShopProducts}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxShopProducts: e.target.value }))
                }
              />
              <TextField
                label="Broj proizvoda"
                size="small"
                type="number"
                fullWidth
                value={form.numberOfProducts}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numberOfProducts: e.target.value }))
                }
              />
              <TextField
                label="Broj akcija"
                size="small"
                type="number"
                fullWidth
                value={form.numberOfActions}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numberOfActions: e.target.value }))
                }
              />
              <TextField
                label="Broj blogova"
                size="small"
                type="number"
                fullWidth
                value={form.numberOfBlogs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numberOfBlogs: e.target.value }))
                }
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.onlyOnline}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, onlyOnline: e.target.checked }))
                    }
                  />
                }
                label="Samo online"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.onlyOnThisSite}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        onlyOnThisSite: e.target.checked
                      }))
                    }
                  />
                }
                label="Samo na ovom sajtu"
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
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Promovisan od"
                size="small"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.shopPromotedAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shopPromotedAt: e.target.value }))
                }
              />
              <TextField
                label="Promovisan do"
                size="small"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.shopPromotedUntil}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shopPromotedUntil: e.target.value }))
                }
              />
            </Box>

            {/* ── Adresa ── */}
            <Divider>
              <Typography variant="caption">Adresa</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Ulica"
                size="small"
                fullWidth
                value={form.address.street}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, street: e.target.value }
                  }))
                }
              />
              <TextField
                label="Poštanski broj"
                size="small"
                type="number"
                fullWidth
                value={form.address.zipCode}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, zipCode: e.target.value }
                  }))
                }
              />
              <TextField
                label="Grad"
                size="small"
                fullWidth
                value={form.address.city}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, city: e.target.value }
                  }))
                }
              />
              <TextField
                label="Država"
                size="small"
                fullWidth
                value={form.address.country}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    address: { ...f.address, country: e.target.value }
                  }))
                }
              />
            </Box>

            {/* ── Društvene mreže ── */}
            <Divider>
              <Typography variant="caption">Društvene mreže</Typography>
            </Divider>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Instagram"
                size="small"
                fullWidth
                value={form.socialMedia.instagram}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialMedia: { ...f.socialMedia, instagram: e.target.value }
                  }))
                }
              />
              <TextField
                label="Facebook"
                size="small"
                fullWidth
                value={form.socialMedia.facebook}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialMedia: { ...f.socialMedia, facebook: e.target.value }
                  }))
                }
              />
              <TextField
                label="TikTok"
                size="small"
                fullWidth
                value={form.socialMedia.tiktok}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialMedia: { ...f.socialMedia, tiktok: e.target.value }
                  }))
                }
              />
              <TextField
                label="LinkedIn"
                size="small"
                fullWidth
                value={form.socialMedia.linkedin}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialMedia: { ...f.socialMedia, linkedin: e.target.value }
                  }))
                }
              />
            </Box>

            {/* ── Radno vreme ── */}
            <Divider>
              <Typography variant="caption">Radno vreme</Typography>
            </Divider>
            {DAYS.map((day) => (
              <Box
                key={day}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr auto',
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2">{DAY_LABELS[day]}</Typography>
                <TextField
                  label="Otvaranje"
                  size="small"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  disabled={form.workingTime[day]?.isClosed}
                  value={form.workingTime[day]?.open ?? ''}
                  onChange={(e) => setDay(day, 'open', e.target.value)}
                />
                <TextField
                  label="Zatvaranje"
                  size="small"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  disabled={form.workingTime[day]?.isClosed}
                  value={form.workingTime[day]?.close ?? ''}
                  onChange={(e) => setDay(day, 'close', e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={form.workingTime[day]?.isClosed ?? false}
                      onChange={(e) =>
                        setDay(day, 'isClosed', e.target.checked)
                      }
                    />
                  }
                  label="Zatvoreno"
                />
              </Box>
            ))}
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
            {editingUser ? 'Sačuvaj izmene' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteId}
        title="Obriši korisnika"
        description="Da li ste sigurni da želite da obrišete ovog korisnika?"
        cancelText="Otkaži"
        confirmText="Obriši"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        isLoading={deleteMut.isPending}
      />
    </Box>
  );
};
