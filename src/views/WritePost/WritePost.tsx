import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useCreateBlogPost } from '@green-world/hooks/useCreateBlogPost';
import { useImage } from '@green-world/hooks/useImage';
import { request } from '@green-world/utils/api';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Image as ImageIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { useNavigate, useParams } from 'react-router';
import 'react-quill-new/dist/quill.snow.css';

type Block = {
  id: string;
  type: 'text' | 'image';
  text?: string;
  image?: string;
};

export const WritePost = () => {
  const navigate = useNavigate();
  const { mutate: uploadImage, isPending: isImageUploading } = useImage();
  const {
    mutate: createPost,
    isPending: isCreating,
    error
  } = useCreateBlogPost();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    blocks?: string;
    coverImage?: string;
    keywords?: string;
    timeOfReading?: string;
  }>({});
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [timeOfReading, setTimeOfReading] = useState<number | ''>('');
  const { postId } = useParams<{ postId?: string }>();
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Blog', route: '/blog' },
    {
      label: postId ? 'Izmeni post' : 'Novi post',
      route: postId ? `/write-post/${postId}` : '/write-post'
    }
  ];

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Naslov je obavezan';
    if (!author.trim()) newErrors.author = 'Autor je obavezan';
    if (blocks.length === 0) {
      newErrors.blocks = 'Dodajte minimum jedan blok';
    } else {
      const hasEmpty = blocks.some((b) => {
        if (b.type === 'text')
          return !(b.text && b.text.replace(/<[^>]*>/g, '').trim());
        if (b.type === 'image') return !(b.image && b.image.trim());
        return false;
      });
      if (hasEmpty) newErrors.blocks = 'Svi blokovi moraju imati sadržaj';
    }
    if (!coverImage) newErrors.coverImage = 'Naslovna slika je obavezna';
    if (keywords.length > 5) newErrors.keywords = 'Maksimalno 5 ključnih reči';
    const invalidKeyword = keywords.find((k) => !k || /\s+/.test(k));
    if (invalidKeyword)
      newErrors.keywords = 'Ključne reči moraju biti jedne reči bez razmaka';
    if (
      timeOfReading !== '' &&
      (Number.isNaN(Number(timeOfReading)) || Number(timeOfReading) <= 0)
    )
      newErrors.timeOfReading = 'Unesite pozitivnu vrednost (minuti)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasEmptyBlock = useMemo(() => {
    if (blocks.length === 0) return true;
    return blocks.some((b) => {
      if (b.type === 'text')
        return !(b.text && b.text.replace(/<[^>]*>/g, '').trim());
      if (b.type === 'image') return !(b.image && b.image.trim());
      return false;
    });
  }, [blocks]);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadImage(formData, {
      onSuccess: (imageUrl: string) => {
        setCoverImage(imageUrl);
      }
    });
  };

  // Load existing post for editing
  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setIsLoadingPost(true);
    request({ url: `/blog-post/post/${postId}`, method: 'get' })
      .then((res: any) => {
        if (!mounted || !res) return;
        setTitle(res.title || '');
        setAuthor(res.author || '');
        setCoverImage(res.coverImage || '');
        const mappedBlocks: Block[] = (res.blocks || []).map(
          (b: any, i: number) => ({
            id: b._id || `${Date.now()}_${i}`,
            type: b.type,
            text: b.text,
            image: b.image
          })
        );
        setBlocks(mappedBlocks);
        setKeywords(res.keywords || []);
        setTimeOfReading(res.timeOfReading ?? '');
      })
      .catch(() => {
        // optionally handle fetch error
      })
      .finally(() => {
        if (mounted) setIsLoadingPost(false);
      });
    return () => {
      mounted = false;
    };
  }, [postId]);

  useEffect(() => {
    if (!errors.blocks) return;
    if (blocks.length === 0) return; // still invalid until user adds
    const hasEmpty = blocks.some((b) => {
      if (b.type === 'text')
        return !(b.text && b.text.replace(/<[^>]*>/g, '').trim());
      if (b.type === 'image') return !(b.image && b.image.trim());
      return false;
    });
    if (!hasEmpty) {
      setErrors((prev) => ({ ...prev, blocks: undefined }));
    }
  }, [blocks, errors.blocks]);

  useEffect(() => {
    if (!errors.coverImage) return;
    if (coverImage) setErrors((prev) => ({ ...prev, coverImage: undefined }));
  }, [coverImage, errors.coverImage]);

  useEffect(() => {
    if (!errors.title) return;
    if (title && title.trim())
      setErrors((prev) => ({ ...prev, title: undefined }));
  }, [title, errors.title]);

  useEffect(() => {
    if (!errors.author) return;
    if (author && author.trim())
      setErrors((prev) => ({ ...prev, author: undefined }));
  }, [author, errors.author]);

  useEffect(() => {
    if (!errors.keywords) return;
    if (keywords.length === 0) return;
    if (keywords.length <= 5 && !keywords.some((k) => !k || /\s+/.test(k))) {
      setErrors((prev) => ({ ...prev, keywords: undefined }));
    }
  }, [keywords, errors.keywords]);

  useEffect(() => {
    if (!errors.timeOfReading) return;
    if (timeOfReading !== '' && Number(timeOfReading) > 0) {
      setErrors((prev) => ({ ...prev, timeOfReading: undefined }));
    }
  }, [timeOfReading, errors.timeOfReading]);

  const addBlock = (type: 'text' | 'image') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      text: type === 'text' ? '' : undefined,
      image: type === 'image' ? '' : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (!k) return;
    if (k.includes(' ')) {
      setErrors((prev) => ({
        ...prev,
        keywords: 'Ključna reč mora biti jedna reč'
      }));
      return;
    }
    if (keywords.length >= 5) {
      setErrors((prev) => ({
        ...prev,
        keywords: 'Maksimalno 5 ključnih reči'
      }));
      return;
    }
    if (keywords.includes(k)) {
      setKeywordInput('');
      return;
    }
    setKeywords([...keywords, k]);
    setKeywordInput('');
  };

  const removeKeyword = (k: string) => {
    setKeywords(keywords.filter((x) => x !== k));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const moveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[index - 1]
    ];
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [
      newBlocks[index + 1],
      newBlocks[index]
    ];
    setBlocks(newBlocks);
  };

  const updateBlockText = (id: string, text: string) => {
    setBlocks(
      blocks?.map((block) => (block.id === id ? { ...block, text } : block))
    );
  };

  const uploadBlockImage = (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    uploadImage(formData, {
      onSuccess: (imageUrl: string) => {
        setBlocks(
          blocks?.map((block) =>
            block.id === id ? { ...block, image: imageUrl } : block
          )
        );
      }
    });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      title,
      author,
      coverImage,
      keywords,
      timeOfReading: timeOfReading === '' ? undefined : timeOfReading,
      blocks: blocks?.map(({ type, text, image }) => ({
        type,
        ...(text ? { text } : {}),
        ...(image ? { image } : {})
      }))
    };

    if (postId) {
      setIsSubmitting(true);
      try {
        await request({
          url: `/blog-post/post/${postId}`,
          method: 'put',
          data: payload
        });
        navigate('/blog');
      } catch (err) {
        // optionally show error
      } finally {
        setIsSubmitting(false);
      }
    } else {
      createPost(payload, {
        onSuccess: () => {
          navigate('/blog');
        }
      });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni svet | Napiši post'} />
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          gap: 4,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column'
        })}
      >
        <AppBreadcrumbs pages={pages} />

        <Typography variant="h1" color="secondary.main">
          Napiši novi post
        </Typography>

        {error && (
          <Alert severity="error">
            {(error as any)?.response?.data?.message ||
              'Greška prilikom kreiranja posta'}
          </Alert>
        )}

        <Box>
          <label
            htmlFor="post-title"
            style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}
          >
            <Typography component="span" variant="subtitle2">
              Naslov posta
            </Typography>
          </label>
          <TextField
            id="post-title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isCreating || isImageUploading}
          />
        </Box>

        <Box>
          <label
            htmlFor="post-author"
            style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}
          >
            <Typography component="span" variant="subtitle2">
              Autor
            </Typography>
          </label>
          <TextField
            id="post-author"
            fullWidth
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            error={!!errors.author}
            helperText={errors.author}
            disabled={isCreating || isImageUploading}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ display: 'block', mb: 1 }}>
            Ključne reči (maks. 5, jedna reč svaka)
          </Typography>
          <Box display="flex" gap={2} alignItems="flex-start">
            <TextField
              sx={{ mt: '1.5px' }}
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Dodaj ključnu reč"
              size="small"
              disabled={isCreating || isImageUploading || keywords.length >= 5}
              error={!!errors.keywords}
              helperText={errors.keywords}
            />
            <Button
              variant="outlined"
              onClick={addKeyword}
              disabled={isCreating || isImageUploading || keywords.length >= 5}
            >
              Dodaj
            </Button>
          </Box>
          <Box display="flex" gap={1} mt={1}>
            {keywords?.map((k) => (
              <Chip key={k} label={k} onDelete={() => removeKeyword(k)} />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Vreme čitanja (min)
          </Typography>
          <TextField
            type="number"
            size="small"
            value={timeOfReading}
            onChange={(e) =>
              setTimeOfReading(
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            error={!!errors.timeOfReading}
            helperText={errors.timeOfReading}
            sx={{ width: 160 }}
            disabled={isCreating || isImageUploading}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Naslovna slika
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<ImageIcon />}
            disabled={isCreating || isImageUploading}
          >
            {coverImage ? 'Promeni sliku' : 'Dodaj naslovnu sliku'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleCoverImageUpload}
            />
          </Button>
          {coverImage && (
            <Box mt={2}>
              <img
                src={formatImageUrl(coverImage)}
                alt="Cover"
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            </Box>
          )}
          {errors.coverImage && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: 'block' }}
            >
              {errors.coverImage}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Sadržaj posta
          </Typography>

          {errors.blocks && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.blocks}
            </Alert>
          )}

          {blocks?.map((block, index) => (
            <Card key={block.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="subtitle2">
                    {block.type === 'text' ? 'Tekst blok' : 'Slika blok'}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => moveBlockUp(index)}
                      disabled={index === 0 || isCreating || isImageUploading}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => moveBlockDown(index)}
                      disabled={
                        index === blocks.length - 1 ||
                        isCreating ||
                        isImageUploading
                      }
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeBlock(block.id)}
                      disabled={isCreating || isImageUploading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                {block.type === 'text' ? (
                  <ReactQuill
                    value={block.text || ''}
                    onChange={(value) => updateBlockText(block.id, value)}
                    theme="snow"
                  />
                ) : (
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      disabled={isCreating || isImageUploading}
                    >
                      {block.image ? 'Promeni sliku' : 'Dodaj sliku'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadBlockImage(block.id, file);
                        }}
                      />
                    </Button>
                    {block.image && (
                      <Box mt={2}>
                        <img
                          src={formatImageUrl(block.image)}
                          alt="Block"
                          style={{ maxWidth: '100%', maxHeight: 300 }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => addBlock('text')}
              disabled={isCreating || isImageUploading}
            >
              Dodaj blok tekst
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => addBlock('image')}
              disabled={isCreating || isImageUploading}
            >
              Dodaj sliku u blog
            </Button>
          </Box>
        </Box>

        {/* Submit */}
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={
              isCreating ||
              isImageUploading ||
              hasEmptyBlock ||
              !coverImage ||
              isLoadingPost ||
              isSubmitting
            }
          >
            {isCreating ? <CircularProgress size={24} /> : 'Objavi post'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/blog')}>
            Otkaži
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
