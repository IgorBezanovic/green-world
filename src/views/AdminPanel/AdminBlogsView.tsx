'use client';

import { AdminImageManager } from '@green-world/components/AdminImageManager/AdminImageManager';
import { AdminTable } from '@green-world/components/AdminTable';
import { DeleteConfirmDialog } from '@green-world/components/DeleteConfirmDialog';
import { useDebounce } from '@green-world/hooks/useDebounce';
import { useImage } from '@green-world/hooks/useImage';
import {
  adminCreateBlog,
  adminDeleteBlog,
  adminGetBlogs,
  adminGetUsersList,
  adminUpdateBlog,
  type AdminBlogItem
} from '@green-world/services/adminApi';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Image as ImageIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
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
    min-height: 180px !important;
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    border-color: rgb(38 96 65) !important;
  }
  .ql-editor { word-break: break-word; overflow-wrap: break-word; }
`;

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

type Block = {
  id: string;
  type: 'text' | 'image';
  text?: string;
  image?: string;
};

const emptyForm = {
  createdBy: '',
  title: '',
  coverImage: [] as string[],
  author: '',
  keywords: '',
  timeOfReading: '',
  viewCounter: '',
  verified: false,
  verifiedDone: false,
  status: 'active',
  blocks: [] as Block[]
};

export const AdminBlogsView = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchValue = debouncedSearch.trim();
  const searchById = OBJECT_ID_REGEX.test(searchValue);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending: isImageUploading } = useImage();

  const { data, isFetching } = useQuery({
    queryKey: ['adminBlogs', { searchValue, page }],
    queryFn: () =>
      adminGetBlogs({
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
    mutationFn: adminCreateBlog,
    onSuccess: () => {
      toast.success('Blog kreiran');
      qc.invalidateQueries({ queryKey: ['adminBlogs'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminUpdateBlog(id, data),
    onSuccess: () => {
      toast.success('Blog ažuriran');
      qc.invalidateQueries({ queryKey: ['adminBlogs'] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteBlog,
    onSuccess: () => {
      toast.success('Blog obrisan');
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Greška')
  });

  useEffect(() => {
    if (editing) {
      const b = editing as any;
      setForm({
        createdBy: b.createdBy?._id ?? '',
        title: b.title ?? '',
        coverImage: b.coverImage ? [b.coverImage] : [],
        author: b.author ?? '',
        keywords: Array.isArray(b.keywords) ? b.keywords.join(', ') : '',
        timeOfReading: b.timeOfReading != null ? String(b.timeOfReading) : '',
        viewCounter: b.viewCounter != null ? String(b.viewCounter) : '',
        verified: b.verified ?? false,
        verifiedDone: b.verifiedDone ?? false,
        status: b.status ?? 'active',
        blocks: (b.blocks ?? []).map((bl: any, i: number) => ({
          id: bl._id || `${Date.now()}_${i}`,
          type: bl.type === 'image' ? 'image' : 'text',
          text: bl.text,
          image: bl.image
        }))
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleClose = () => {
    setFormOpen(false);
    setEditing(null);
  };
  const isSaving = createMut.isPending || updateMut.isPending;

  // ── Block helpers ──
  const addBlock = (type: 'text' | 'image') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      text: type === 'text' ? '' : undefined,
      image: type === 'image' ? '' : undefined
    };
    setForm((f) => ({ ...f, blocks: [...f.blocks, newBlock] }));
  };

  const removeBlock = (id: string) =>
    setForm((f) => ({ ...f, blocks: f.blocks.filter((b) => b.id !== id) }));

  const moveBlock = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const next = [...f.blocks];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];
      return { ...f, blocks: next };
    });
  };

  const updateBlockText = (id: string, text: string) =>
    setForm((f) => ({
      ...f,
      blocks: f.blocks.map((b) => (b.id === id ? { ...b, text } : b))
    }));

  const uploadBlockImage = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const url = await uploadImage(formData);
      setForm((f) => ({
        ...f,
        blocks: f.blocks.map((b) => (b.id === id ? { ...b, image: url } : b))
      }));
    } catch {
      toast.error('Greška pri otpremanju slike bloka');
    }
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      coverImage: form.coverImage[0] ?? '',
      keywords: form.keywords
        ? form.keywords
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      timeOfReading:
        form.timeOfReading !== '' ? Number(form.timeOfReading) : undefined,
      viewCounter:
        form.viewCounter !== '' ? Number(form.viewCounter) : undefined,
      blocks: form.blocks.map(({ type, text, image }) => ({
        type,
        ...(text !== undefined ? { text } : {}),
        ...(image !== undefined ? { image } : {})
      }))
    };
    editing
      ? updateMut.mutate(
          { id: editing._id, data: payload },
          { onSuccess: handleClose }
        )
      : createMut.mutate(payload, { onSuccess: handleClose });
  };

  const columns = [
    { key: 'title', label: 'Naziv' },
    { key: 'status', label: 'Status' },
    {
      key: 'createdBy',
      label: 'Autor',
      render: (r: AdminBlogItem) =>
        typeof r.createdBy === 'object' ? r.createdBy.name : '—'
    },
    {
      key: 'createdAt',
      label: 'Datum',
      render: (r: AdminBlogItem) =>
        new Date(r.createdAt).toLocaleDateString('sr-RS')
    }
  ];

  return (
    <Box>
      <AdminTable
        title="Blogovi"
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
        createLabel="Dodaj blog"
      />

      <Dialog open={formOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>{editing ? 'Izmeni blog' : 'Novi blog'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* ── Osnovni podaci ── */}
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
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
            >
              <TextField
                label="Naslov"
                size="small"
                required
                fullWidth
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <TextField
                label="Autor"
                size="small"
                fullWidth
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
              />
              <TextField
                label="Ključne reči (zareza razdvojene)"
                size="small"
                fullWidth
                value={form.keywords}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keywords: e.target.value }))
                }
              />
            </Box>

            {/* ── Cover slika ── */}
            <Divider>
              <Typography variant="caption">Cover slika</Typography>
            </Divider>
            <AdminImageManager
              images={form.coverImage}
              onChange={(imgs) => setForm((f) => ({ ...f, coverImage: imgs }))}
              maxImages={1}
            />

            {/* ── Status i statistike ── */}
            <Divider>
              <Typography variant="caption">Status i statistike</Typography>
            </Divider>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2
              }}
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
                label="Vreme čitanja (min)"
                size="small"
                type="number"
                fullWidth
                value={form.timeOfReading}
                onChange={(e) =>
                  setForm((f) => ({ ...f, timeOfReading: e.target.value }))
                }
              />
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

            {/* ── Blokovi sadržaja ── */}
            <Divider>
              <Typography variant="caption">Blokovi sadržaja</Typography>
            </Divider>

            {form.blocks.map((block, index) => (
              <Card key={block.id} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Blok {index + 1} —{' '}
                      {block.type === 'text' ? 'Tekst' : 'Slika'}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        disabled={index === 0}
                        onClick={() => moveBlock(index, -1)}
                      >
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={index === form.blocks.length - 1}
                        onClick={() => moveBlock(index, 1)}
                      >
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeBlock(block.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {block.type === 'text' ? (
                    <Box>
                      <ReactQuill
                        modules={quillModules}
                        value={block.text || ''}
                        onChange={(v) => updateBlockText(block.id, v)}
                        theme="snow"
                        style={{ minHeight: 180 }}
                      />
                      <style>{quillStyle}</style>
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={
                          isImageUploading ? (
                            <CircularProgress size={14} />
                          ) : (
                            <ImageIcon />
                          )
                        }
                        disabled={isImageUploading}
                        size="small"
                      >
                        {block.image ? 'Zameni sliku' : 'Dodaj sliku bloka'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadBlockImage(block.id, f);
                          }}
                        />
                      </Button>
                      {block.image && (
                        <Box mt={1.5}>
                          <Box
                            component="img"
                            src={formatImageUrl(block.image)}
                            alt="block-img"
                            sx={{
                              maxWidth: '100%',
                              maxHeight: 300,
                              borderRadius: 1,
                              objectFit: 'contain'
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}

            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => addBlock('text')}
              >
                Dodaj tekst blok
              </Button>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => addBlock('image')}
              >
                Dodaj slika blok
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSaving || isImageUploading}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            disabled={isSaving || isImageUploading}
            startIcon={isSaving ? <CircularProgress size={14} /> : null}
            onClick={handleSubmit}
          >
            {editing ? 'Sačuvaj' : 'Kreiraj'}
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteId}
        title="Obriši blog"
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
