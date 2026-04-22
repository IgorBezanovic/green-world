'use client';

import { useDeleteImage } from '@green-world/hooks/useDeleteImage';
import { useImage } from '@green-world/hooks/useImage';
import { formatImageUrl } from '@green-world/utils/helpers';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography
} from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const MAX_IMAGE_MB = 10 * 1024 * 1024;

interface AdminImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const AdminImageManager = ({
  images,
  onChange,
  maxImages = 10
}: AdminImageManagerProps) => {
  const { mutateAsync: uploadImage, isPending: isUploading } = useImage();
  const { mutate: deleteImageMutate } = useDeleteImage();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = '';
    if (!selectedFiles.length) return;

    const slots = Math.max(0, maxImages - images.length);
    const filesToUpload = selectedFiles.slice(0, slots);

    let current = [...images];
    for (const file of filesToUpload) {
      if (file.size > MAX_IMAGE_MB) continue;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const url = await uploadImage(formData);
        current = [...current, url];
        onChange(current);
      } catch {
        // continue
      }
    }
  };

  const handleDelete = (index: number) => {
    const url = images[index];
    deleteImageMutate(url);
    onChange(images.filter((_, i) => i !== index));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveRight = (index: number) => {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    onChange(next);
  };

  const setAsFirst = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <Box>
      <Divider sx={{ mb: 1 }}>
        <Typography variant="caption">Slike</Typography>
      </Divider>

      {images.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 1.5,
            mb: 2,
            p: 1.5,
            border: '1px solid',
            borderColor: 'secondary.main',
            borderRadius: 1
          }}
        >
          {images.map((url, index) => (
            <Box
              key={`${url}-${index}`}
              sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
            >
              <Box sx={{ position: 'relative' }}>
                <DeleteOutlinedIcon
                  onClick={() => handleDelete(index)}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    color: 'primary.main',
                    fontSize: 24,
                    cursor: 'pointer',
                    zIndex: 2,
                    bgcolor: 'rgba(255,255,255,0.85)',
                    borderRadius: 1
                  }}
                />
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 6,
                      left: 6,
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 0.5,
                      zIndex: 2
                    }}
                  >
                    Profilna
                  </Box>
                )}
                <Box
                  component="img"
                  src={formatImageUrl(url, 55)}
                  alt={`img-${index}`}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: 1,
                    boxShadow: 1,
                    display: 'block'
                  }}
                />
              </Box>

              {/* Reorder buttons */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={index === 0}
                  onClick={() => moveLeft(index)}
                  sx={{ minWidth: 0, flex: 1, p: 0.5 }}
                >
                  <ArrowLeft size={14} />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={index === images.length - 1}
                  onClick={() => moveRight(index)}
                  sx={{ minWidth: 0, flex: 1, p: 0.5 }}
                >
                  <ArrowRight size={14} />
                </Button>
              </Box>

              {index !== 0 && (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => setAsFirst(index)}
                  sx={{ fontSize: '0.7rem', textTransform: 'none', py: 0.5 }}
                >
                  Postavi kao profilnu
                </Button>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Button
        component="label"
        variant="outlined"
        color="primary"
        disabled={images.length >= maxImages || isUploading}
        sx={{ mb: 1 }}
      >
        {isUploading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} />
            Otpremanje...
          </Box>
        ) : images.length >= maxImages ? (
          `Maksimum ${maxImages} slika`
        ) : (
          'Dodaj fotografiju'
        )}
        <Box
          component="input"
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleUpload}
          sx={{ display: 'none' }}
        />
      </Button>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 1 }}
      >
        Prva slika je profilna. Koristite strelice za promenu redosleda. Max{' '}
        {maxImages} slika, max 10MB po slici.
      </Typography>
    </Box>
  );
};
