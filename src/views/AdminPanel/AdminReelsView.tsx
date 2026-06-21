'use client';

import { TikTokIcon } from '@green-world/components/TikTokIcon';
import { useAdminProducts } from '@green-world/hooks/useAdminProducts';
import { useGenerateReels } from '@green-world/hooks/useGenerateReels';
import { usePublishInstagram } from '@green-world/hooks/usePublishInstagram';
import { usePublishTikTok } from '@green-world/hooks/usePublishTikTok';
import type { AdminProductItem } from '@green-world/services/adminApi';
import {
  formatImageUrl,
  getLocalizedGroupLabel,
  getLocalizedSubGroupLabel
} from '@green-world/utils/helpers';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { Clapperboard, Play, X, Download, Copy, Instagram } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const AdminReelsView = () => {
  const [page, setPage] = useState(1);
  const [selectedReel, setSelectedReel] = useState<{
    productTitle: string;
    reel: any;
    productId: string;
    groupLabelSr: string;
    subGroupLabelSr: string;
  } | null>(null);
  const [promptDialog, setPromptDialog] = useState<{
    productTitle: string;
    prompt: string;
  } | null>(null);

  const { data, isFetching } = useAdminProducts({
    status: 'active',
    page,
    pageSize: 20
  });

  const { mutate: generateReels, isPending: isGenerating } = useGenerateReels();
  const { mutate: publishInstagram, isPending: isPublishingInstagram } =
    usePublishInstagram();
  const { mutate: publishTikTok, isPending: isPublishingTikTok } =
    usePublishTikTok();

  const products: AdminProductItem[] = data?.data ?? [];
  const totalPages = data?.meta?.pages ?? 1;

  const handleMakeReels = (productId: string) => {
    generateReels(productId);
  };

  const handleCloseReelDialog = () => {
    setSelectedReel(null);
  };

  const handleDownloadReel = (reel: any, productTitle: string) => {
    if (!reel.url) return;

    const link = document.createElement('a');
    link.href = reel.url;
    link.download = `${productTitle.replace(/\s+/g, '_')}_reel.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyReelUrl = (reel: any) => {
    if (!reel.url) return;
    navigator.clipboard.writeText(reel.url);
    toast.success('URL je kopiran u clipboard! ✓');
  };

  const handleShareOnInstagram = (reel: any) => {
    if (!reel.url) return;
    publishInstagram({
      videoUrl: reel.url,
      productId: selectedReel?.productId,
      groupLabelSr: selectedReel?.groupLabelSr,
      subGroupLabelSr: selectedReel?.subGroupLabelSr
    });
  };

  const handleShareOnTikTok = (reel: any) => {
    if (!reel.url) return;
    publishTikTok({
      videoUrl: reel.url,
      productId: selectedReel?.productId,
      groupLabelSr: selectedReel?.groupLabelSr,
      subGroupLabelSr: selectedReel?.subGroupLabelSr
    });
  };

  const handleOpenPromptDialog = (productTitle: string, prompt: string) => {
    setPromptDialog({ productTitle, prompt });
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Reels – Aktivni proizvodi
      </Typography>

      {isFetching && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!isFetching && products.length === 0 && (
        <Typography color="text.secondary">Nema aktivnih proizvoda.</Typography>
      )}

      {!isFetching && products.length > 0 && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 2
            }}
          >
            {products.map((product) => (
              <Card
                key={product._id}
                variant="outlined"
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                {product.images?.[0] && (
                  <CardMedia
                    component="img"
                    image={formatImageUrl(product.images[0])}
                    alt={product.title}
                    sx={{ height: 160, objectFit: 'cover' }}
                  />
                )}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    pb: '12px !important'
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={product.title}
                  >
                    {product.title}
                  </Typography>
                  {product.price != null && (
                    <Typography variant="body2" color="text.secondary">
                      {product.price} RSD
                    </Typography>
                  )}
                  {product.priceOnRequest && (
                    <Typography variant="body2" color="text.secondary">
                      Cena na upit
                    </Typography>
                  )}

                  {/* Prikaži reels ako postoje */}
                  {(product as any).reels &&
                    (product as any).reels.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          mt: 1
                        }}
                      >
                        {(product as any).reels.map(
                          (reel: any, idx: number) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: 'action.hover',
                                borderRadius: 1
                              }}
                            >
                              <Chip
                                label={reel.status}
                                size="small"
                                color={
                                  reel.status === 'completed'
                                    ? 'success'
                                    : reel.status === 'failed'
                                      ? 'error'
                                      : 'warning'
                                }
                                variant="outlined"
                              />
                              <Box
                                sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}
                              >
                                {reel.url && (
                                  <>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        setSelectedReel({
                                          productTitle: product.title,
                                          reel,
                                          productId: String(product._id),
                                          groupLabelSr: getLocalizedGroupLabel(
                                            product.group || '',
                                            'sr'
                                          ),
                                          subGroupLabelSr:
                                            getLocalizedSubGroupLabel(
                                              product.group as any,
                                              product.subGroup || '',
                                              'sr'
                                            )
                                        })
                                      }
                                      title="Preglej video"
                                      sx={{
                                        color: 'primary.main',
                                        '&:hover': { bgcolor: 'action.hover' }
                                      }}
                                    >
                                      <Play size={18} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleDownloadReel(reel, product.title)
                                      }
                                      title="Preuzmi video"
                                      sx={{
                                        color: 'info.main',
                                        '&:hover': { bgcolor: 'action.hover' }
                                      }}
                                    >
                                      <Download size={18} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleCopyReelUrl(reel)}
                                      title="Kopiraj URL"
                                      sx={{
                                        color: 'secondary.main',
                                        '&:hover': { bgcolor: 'action.hover' }
                                      }}
                                    >
                                      <Copy size={18} />
                                    </IconButton>
                                  </>
                                )}
                                {reel.prompt && (
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleOpenPromptDialog(
                                        product.title,
                                        reel.prompt
                                      )
                                    }
                                    title="Pogledaj AI skript"
                                    sx={{
                                      color: 'text.secondary',
                                      '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                  >
                                    <Clapperboard size={18} />
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    )}

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Clapperboard size={16} />}
                    onClick={() => handleMakeReels(product._id)}
                    disabled={isGenerating}
                    sx={{ mt: 'auto' }}
                  >
                    {isGenerating ? 'Generisem...' : 'Napravi reels'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={!!selectedReel}
        onClose={handleCloseReelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pb: 1
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {selectedReel?.productTitle}
            </Typography>
            {selectedReel?.reel?.generatedAt && (
              <Typography variant="caption" color="text.secondary">
                Kreirano:{' '}
                {new Date(selectedReel.reel.generatedAt).toLocaleString(
                  'sr-RS'
                )}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleCloseReelDialog}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {selectedReel?.reel?.url ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  bgcolor: '#000',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="video"
                  src={selectedReel.reel.url}
                  controls
                  width="100%"
                  height="auto"
                  sx={{ display: 'block', borderRadius: 1, bgcolor: '#000' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 48,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    px: 1,
                    py: 0.5,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    pointerEvents: 'none'
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                      letterSpacing: 0.5
                    }}
                  >
                    {selectedReel.productTitle}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Download size={18} />}
                  onClick={() =>
                    handleDownloadReel(
                      selectedReel.reel,
                      selectedReel.productTitle
                    )
                  }
                  fullWidth
                >
                  Preuzmi
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Copy size={18} />}
                  onClick={() => handleCopyReelUrl(selectedReel.reel)}
                  title="Kopira URL u clipboard"
                  sx={{ minWidth: 130 }}
                >
                  Kopiraj URL
                </Button>
              </Box>
              <Button
                variant="contained"
                startIcon={
                  isPublishingInstagram ? (
                    <CircularProgress size={18} sx={{ color: '#fff' }} />
                  ) : (
                    <Instagram size={18} />
                  )
                }
                onClick={() => handleShareOnInstagram(selectedReel.reel)}
                disabled={isPublishingInstagram || isPublishingTikTok}
                fullWidth
                sx={{ bgcolor: '#E4405F', '&:hover': { bgcolor: '#D63447' } }}
              >
                {isPublishingInstagram
                  ? 'Objavljujem...'
                  : 'Objavi na Instagram'}
              </Button>
              <Button
                variant="contained"
                startIcon={
                  isPublishingTikTok ? (
                    <CircularProgress size={18} sx={{ color: '#fff' }} />
                  ) : (
                    <TikTokIcon color="#fff" size="18px" />
                  )
                }
                onClick={() => handleShareOnTikTok(selectedReel.reel)}
                disabled={isPublishingTikTok || isPublishingInstagram}
                fullWidth
                sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#1a1a1a' } }}
              >
                {isPublishingTikTok ? 'Objavljujem...' : 'Objavi na TikTok'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.open(selectedReel.reel.url, '_blank')}
                fullWidth
              >
                Otvori u novoj kartici
              </Button>
            </Box>
          ) : (
            <Typography color="text.secondary">Video nije dostupan</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Prompt/Script dialog */}
      <Dialog
        open={!!promptDialog}
        onClose={() => setPromptDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              AI Skript – {promptDialog?.productTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Prompt koji je generisan za Seedance video generisanje
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setPromptDialog(null)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 2,
              whiteSpace: 'pre-wrap',
              fontSize: 14,
              lineHeight: 1.7,
              fontFamily: 'monospace',
              maxHeight: 400,
              overflowY: 'auto'
            }}
          >
            {promptDialog?.prompt}
          </Box>
          <Button
            variant="outlined"
            startIcon={<Copy size={16} />}
            onClick={() => {
              if (promptDialog?.prompt) {
                navigator.clipboard.writeText(promptDialog.prompt);
                toast.success('Skript kopiran!');
              }
            }}
            sx={{ mt: 2 }}
          >
            Kopiraj skript
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
