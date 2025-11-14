import {
  ProductSection,
  MetaTags,
  AppBreadcrumbs,
  ZSLogoLogoMark
} from '@green-world/components';
import Chat from '@green-world/components/Chat/Chat';
import { ChatContext } from '@green-world/context/ChatContext';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useProduct } from '@green-world/hooks/useProduct';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { useUser } from '@green-world/hooks/useUser';
import { homeCategories } from '@green-world/utils/constants';
import { getItem } from '@green-world/utils/cookie';
import {
  formatImageUrl,
  goToDestination,
  translateGroupToSr,
  translateSubGroupToSr
} from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  Divider,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import {
  Store,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldUser,
  Check,
  Users,
  Receipt
} from 'lucide-react';
import { useMemo, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  FullImageDialog,
  ProductDescription,
  ProductSpecification
} from './components';

export const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: productData, isLoading: productLoading } = useProduct(
    productId!
  );
  const { data: sellerData, isLoading: userLoading } = useUser(
    productData?.createdBy || ''
  );
  const [idexOfImage, setIndexOfImage] = useState(0);
  const { data: groupProducts, isLoading: groupProductsLoading } =
    useProductsByGroup(productData?.group || '');
  const { data: sellerProducts, isLoading: sellerProductsLoading } =
    useAllUserProducts(productData?.createdBy);
  const [openImageModal, setOpenImageModal] = useState(false);
  const token = getItem('token');
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const handlePrev = () => {
    if (!productData?.images.length) return;

    setIndexOfImage((prevIndex) =>
      prevIndex === 0 ? productData?.images?.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!productData?.images.length) return;

    setIndexOfImage((prevIndex) =>
      prevIndex === productData?.images?.length - 1 ? 0 : prevIndex + 1
    );
  };
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { openChat } = useContext(ChatContext);

  const metaObj = useMemo(
    () => ({
      title: productData
        ? ['Zeleni svet', productData.title, 'Proizvod']
            .filter(Boolean)
            .join(' | ')
        : 'Zeleni svet | proizvod',
      description: productData?.description || 'Proizvod Zeleni Svet',
      image:
        formatImageUrl(productData?.images[0] || '') ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [productData]
  );
  if (!productId) return <></>;

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Proizvodi', route: '/search' },
    { label: productData?.title || 'Proizvod', route: `/product/${productId}` }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title={metaObj.title}
        description={metaObj.description}
        keywords={metaObj.description}
        image={metaObj.image}
      />
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
        <Divider />
        {productLoading || userLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton
              variant="rectangular"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%'
            }}
          >
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up('md')]: {
                  flexDirection: 'row'
                },
                gap: 4
              })}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: '16px'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    overflow: 'hidden'
                  }}
                >
                  {productData?.images.length &&
                    productData?.images.length !== 1 && (
                      <Button
                        onClick={handlePrev}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 50,
                          backgroundColor: 'rgba(81, 81, 81, 0.60)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          transition: 'all 0.3s ease',
                          opacity: { xs: 1, md: 0 },
                          '&:hover': {
                            opacity: { md: 1 },
                            backgroundColor: 'rgba(81, 81, 81, 0.60)',
                            '& .arrow-icon-left': {
                              display: 'flex'
                            }
                          },
                          minWidth: 0,
                          padding: 0
                        }}
                      >
                        <Box
                          className="arrow-icon-left"
                          sx={(theme) => ({
                            [theme.breakpoints.up('md')]: {
                              display: 'none'
                            },
                            transition: 'opacity 0.3s ease'
                          })}
                        >
                          <ArrowLeft className="override-size" color="#fff" />
                        </Box>
                      </Button>
                    )}
                  <Box
                    component="img"
                    src={formatImageUrl(productData?.images[idexOfImage] || '')}
                    alt={productData?.title}
                    onClick={() => setOpenImageModal(true)}
                    sx={{
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                  />
                  {productData?.images.length &&
                    productData?.images.length !== 1 && (
                      <Button
                        onClick={handleNext}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 50,
                          backgroundColor: 'rgba(81, 81, 81, 0.60)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          transition: 'all 0.3s ease',
                          opacity: { xs: 1, md: 0 },
                          '&:hover': {
                            opacity: { md: 1 },
                            backgroundColor: 'rgba(81, 81, 81, 0.60)',
                            '& .arrow-icon-right': {
                              display: 'flex'
                            }
                          },
                          minWidth: 0,
                          padding: 0
                        }}
                      >
                        <Box
                          className="arrow-icon-right"
                          sx={(theme) => ({
                            [theme.breakpoints.up('md')]: {
                              display: 'none'
                            },
                            transition: 'opacity 0.3s ease'
                          })}
                        >
                          <ArrowRight className="override-size" color="#fff" />
                        </Box>
                      </Button>
                    )}
                </Box>
                {productData?.images?.length &&
                  productData?.images?.length > 1 && (
                    <Box
                      component="footer"
                      sx={(theme) => ({
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        [theme.breakpoints.up('xs')]: {
                          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
                        },
                        width: '100%',
                        gap: '16px'
                      })}
                    >
                      {productData?.images.map(
                        (image: string, index: number) => (
                          <Box
                            component="img"
                            src={formatImageUrl(image, 55)}
                            alt={image}
                            key={image}
                            onClick={() => setIndexOfImage(index)}
                            sx={(theme) => ({
                              borderRadius: '6px',
                              boxShadow:
                                'var(--mui-shadow, 0px 1px 3px rgba(0,0,0,0.1))',
                              aspectRatio: '1 / 1',
                              width: '100%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',

                              ...(idexOfImage === index && {
                                boxShadow: theme.shadows[10],
                                border: '2px solid',
                                borderColor: 'forestGreen'
                              })
                            })}
                          />
                        )
                      )}
                    </Box>
                  )}
              </Box>
              <Box
                sx={{
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h1">{productData?.title}</Typography>
                <Box sx={{ mt: 1, mb: 3, display: 'flex', gap: 1 }}>
                  <Chip
                    label={translateGroupToSr(productData?.group || '')}
                    color="success"
                    sx={{
                      height: '24px'
                    }}
                  />
                  <Chip
                    label={translateSubGroupToSr(
                      productData?.group,
                      productData?.subGroup || ''
                    )}
                    color="primary"
                    sx={{
                      height: '24px'
                    }}
                  />
                </Box>
                <Typography variant="subtitle2">
                  {productData?.shortDescription}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, my: 5 }}>
                  <Typography variant="h2">
                    {productData?.priceOnRequest
                      ? 'Cena Na Upit'
                      : `${productData?.price.toLocaleString()},00 RSD`}
                  </Typography>
                  {productData?.onStock && (
                    <Typography
                      variant="button"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Check /> Na stanju
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    textAlign: 'center',
                    gap: 1
                  }}
                >
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Users /> Direktan kontakt
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Receipt /> Bez provizije
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <ShieldUser /> Korisnička podrška
                  </Typography>
                </Box>
                <Divider sx={{ my: 4 }} />
                <Card>
                  <CardContent sx={{ padding: '24px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px'
                      }}
                    >
                      {sellerData?.profileImage ? (
                        <Box
                          component="img"
                          sx={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                          src={formatImageUrl(sellerData.profileImage, 55)}
                          alt={sellerData?.name}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'primary.main',
                            fontSize: 24
                          }}
                        >
                          {sellerData?.name?.[0]?.toUpperCase() || ''}
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                          }}
                        >
                          <Store />
                          <Typography variant="h3">
                            {sellerData?.shopName || sellerData?.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="button">
                            {sellerData?.name} {sellerData?.lastname}
                          </Typography>
                          <Typography variant="button">
                            Član od{' '}
                            {dayjs(sellerData?.createdAt).format(
                              'DD/MM/YYYY, HH:mm'
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      {sellerData?.phone && (
                        <Box
                          component="a"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            [theme.breakpoints.down('sm')]: {
                              fontSize: '12px'
                            },
                            gap: '8px',
                            '&:hover': {
                              color: 'primary.main',
                              transition: 'color 0.3s ease'
                            }
                          }}
                          href={`tel:${sellerData?.phone}`}
                        >
                          <Phone />
                          <span>{sellerData?.phone}</span>
                        </Box>
                      )}
                      {sellerData?.email && (
                        <Box
                          component="a"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            [theme.breakpoints.down('sm')]: {
                              fontSize: '12px'
                            },
                            gap: '8px',
                            '&:hover': {
                              color: 'primary.main',
                              transition: 'color 0.3s ease'
                            }
                          }}
                          href={`mailto:${sellerData?.email}`}
                        >
                          <Mail />
                          <span>{sellerData?.email}</span>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'column',
                          [theme.breakpoints.up('sm')]: {
                            flexDirection: 'row'
                          },
                          flexWrap: 'wrap',
                          marginTop: '8px',
                          gap: '16px'
                        }}
                      >
                        <Button
                          sx={{ flex: 1 }}
                          variant="contained"
                          onClick={() => navigate('/shop/' + sellerData?._id)}
                        >
                          Profil
                        </Button>
                        {!sellerData?.onlyOnline && (
                          <Button
                            sx={{ flex: 1 }}
                            variant="outlined"
                            href={goToDestination(
                              sellerData?.address?.street,
                              sellerData?.address?.city,
                              sellerData?.address?.country
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Navigacija
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 4
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={decodedToken?._id === sellerData?._id}
                    onClick={() => {
                      if (isMobileOrTablet) {
                        // Na mobilnim/tablet uređajima otvori Dialog
                        setIsChatOpen(true);
                      } else {
                        // Na desktop uređajima otvori preko ChatLine
                        openChat(
                          sellerData?._id || '',
                          `${sellerData?.name ?? ''} ${sellerData?.lastname ?? ''}`.trim() ||
                            'Prodavac'
                        );
                      }
                    }}
                  >
                    Pošalji poruku
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        bgcolor: theme.palette.primary.dark,
                        color: 'white',
                        px: 0.5,
                        py: '2px',
                        fontSize: '0.5rem',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.3
                      }}
                    >
                      <ZSLogoLogoMark
                        color={theme.palette.primary.contrastText}
                        width="9px"
                      />{' '}
                      Uskoro
                    </Box>
                  </Button>
                  <Dialog
                    open={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    fullWidth
                    fullScreen={isMobileOrTablet}
                    maxWidth="sm"
                    PaperProps={{
                      style: {
                        overflow: 'hidden',
                        ...(isMobileOrTablet && { margin: 0, maxHeight: '100vh' })
                      }
                    }}
                  >
                    {sellerData?._id && (
                      <Chat
                        chatWithId={sellerData._id}
                        userName={
                          `${sellerData?.name ?? ''} ${sellerData?.lastname ?? ''}`.trim() ||
                          'Prodavac'
                        }
                        onClose={() => setIsChatOpen(false)}
                      />
                    )}
                  </Dialog>
                  <Button variant="outlined" color="secondary">
                    Poruči proizvod
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box
              component="section"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up('md')]: {
                  flexDirection: 'row'
                },
                gap: 4,
                marginTop: 4
              }}
            >
              <ProductDescription
                description={productData?.description ?? ''}
              />
              <ProductSpecification product={productData} />
            </Box>
          </Box>
        )}
        <ProductSection
          title="Svi proizvodi prodavca"
          products={sellerProducts}
          isLoading={sellerProductsLoading}
        />
        <ProductSection
          title={`Proizvodi iz grupe ${homeCategories.find((category) => category.slug === productData?.group)?.text}`}
          products={groupProducts}
          isLoading={groupProductsLoading}
        />
      </Box>
      <FullImageDialog
        idexOfImage={idexOfImage}
        handleNext={handleNext}
        handlePrev={handlePrev}
        setOpenImageModal={setOpenImageModal}
        openImageModal={openImageModal}
        productData={productData}
      />
    </Box>
  );
};
