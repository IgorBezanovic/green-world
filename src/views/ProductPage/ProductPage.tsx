'use client';

import {
  ProductSection,
  AppBreadcrumbs,
  PageContent,
  SendMessageDialog,
  ImageGallery,
  VoteButtons,
  CopyLinkButton,
  BookmarkButton,
  DeletedItemOverlay,
  AIVerificationBadge
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { useCreateProductReview } from '@green-world/hooks/useCreateProductReview';
import { useProduct } from '@green-world/hooks/useProduct';
import { useProductsByGroup } from '@green-world/hooks/useProductsByGroup';
import { useUser } from '@green-world/hooks/useUser';
import { useVoteProduct } from '@green-world/hooks/useVoteProduct';
import {
  formatImageUrl,
  goToDestination,
  getLocalizedGroupLabel,
  getLocalizedSubGroupLabel
} from '@green-world/utils/helpers';
import { slugOrId } from '@green-world/utils/slug';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import {
  Store,
  Phone,
  Mail,
  ShieldUser,
  Check,
  Users,
  Receipt,
  CircleX
} from 'lucide-react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import {
  ProductDescription,
  ProductPageSkeleton,
  ProductReviewForm,
  ProductReviewList,
  ProductSpecification
} from './components';

export const ProductPage = () => {
  const { t, i18n } = useTranslation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: productData, isLoading: productLoading } = useProduct(
    productId!
  );
  const { data: sellerData, isLoading: userLoading } = useUser(
    productData?.createdBy || ''
  );
  const { data: groupProducts } = useProductsByGroup(productData?.group || '');
  const { data: sellerProducts } = useAllUserProducts(productData?.createdBy);
  const { mutateAsync: createProductReview } = useCreateProductReview();
  const { mutate: voteMutate } = useVoteProduct(productId || '');
  const { isUserLoggedIn, userId, user } = useContext(UserContext);
  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false);

  const handleProductVote = (vote: 'like' | 'dislike' | string) => {
    if (!productId) return;
    voteMutate({ vote });
  };

  if (!productId) return <></>;

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.products'), route: '/products' },
    {
      label: productData?.title || t('productPage.productFallback'),
      route: `/product/${productId}`
    }
  ];

  const singleLineEllipsisSx = {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const isOwnProduct = Boolean(
    isUserLoggedIn &&
      userId &&
      productData?.createdBy &&
      userId === productData.createdBy
  );

  const hasUserReviewed = Boolean(
    userId &&
      productData?.comments?.some((comment) => {
        if (comment.parentComment) return false;

        const commentAuthorId = String(comment.createdBy || '');
        if (commentAuthorId) {
          return commentAuthorId === userId;
        }

        const currentUserFullName = [user?.name || '', user?.lastname || '']
          .join(' ')
          .trim();
        return Boolean(
          currentUserFullName &&
            currentUserFullName === (comment.author || '').trim()
        );
      })
  );

  const reviewDisabledReason = !isUserLoggedIn
    ? t('productPage.mustLoginToReview')
    : isOwnProduct
      ? t('productPage.cannotReviewOwnProduct')
      : hasUserReviewed
        ? t('productPage.alreadyReviewedProduct')
        : '';

  const handleAddReview = async (
    data: { title?: string; text: string; image?: string },
    parentComment?: string | null
  ) => {
    if (!productId) return;

    const author =
      `${user?.name || ''} ${user?.lastname || ''}`.trim() ||
      t('common.unknownUser');

    await createProductReview({
      productId,
      title: data.title,
      text: data.text,
      image: data.image,
      parentComment,
      author
    });
  };

  return (
    <PageContent>
      {productData?.status === 'deleted' && (
        <DeletedItemOverlay
          itemType="proizvod"
          creatorId={productData?.createdBy}
          creatorNotFound={!userLoading && !sellerData}
        />
      )}
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
          <ProductPageSkeleton />
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
              <ImageGallery
                images={productData?.images || []}
                title={productData?.title}
              />

              <Box
                sx={{
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  <AIVerificationBadge
                    verifiedDone={productData?.verifiedDone}
                    verified={productData?.verified}
                  />
                </Box>
                <Typography
                  variant="h1"
                  sx={(theme) => ({
                    fontFamily: 'var(--font-ephesis, Ephesis), cursive',
                    fontWeight: 400,
                    fontSize: '2.5rem',
                    [theme.breakpoints.up('md')]: {
                      fontSize: '3rem'
                    },
                    color: 'secondary.main',
                    lineHeight: 1.2,
                    mb: 1
                  })}
                >
                  {productData?.title}
                </Typography>
                <Box sx={{ mt: 1, mb: 3, display: 'flex', gap: 1 }}>
                  <Chip
                    label={getLocalizedGroupLabel(
                      productData?.group || '',
                      i18n.language
                    )}
                    color="success"
                    sx={{
                      height: '24px'
                    }}
                  />
                  <Chip
                    label={getLocalizedSubGroupLabel(
                      productData?.group,
                      productData?.subGroup || '',
                      i18n.language
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
                    {productData?.priceOnRequest ? (
                      t('productPage.priceOnRequest')
                    ) : (
                      <>{productData?.price.toLocaleString()} RSD</>
                    )}
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {productData?.onStock ? <Check /> : <CircleX />}{' '}
                    {productData?.onStock
                      ? t('productPage.inStock')
                      : t('productPage.outOfStock')}
                  </Typography>
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
                    <Users /> {t('productPage.directContact')}
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Receipt /> {t('productPage.noCommission')}
                  </Typography>
                  <Typography
                    variant="button"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <ShieldUser /> {t('productPage.userSupport')}
                  </Typography>
                </Box>
                <Divider sx={{ my: 4 }} />
                <Card>
                  <CardContent sx={{ padding: '24px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        '@media (max-width:340px)': {
                          flexDirection: 'column',
                          alignItems: 'center'
                        },
                        '& svg': {
                          flexShrink: 0
                        }
                      }}
                    >
                      {sellerData?.profileImage ? (
                        <Box
                          component="img"
                          sx={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: sellerData?._id ? 'pointer' : 'default'
                          }}
                          src={formatImageUrl(sellerData.profileImage, 55)}
                          alt={sellerData?.name}
                          onClick={() => {
                            if (!sellerData?._id) return;
                            navigate(`/shop/${slugOrId(sellerData)}`);
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'primary.main',
                            fontSize: 24,
                            cursor: sellerData?._id ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (!sellerData?._id) return;
                            navigate(`/shop/${slugOrId(sellerData)}`);
                          }}
                        >
                          {sellerData?.name?.[0]?.toUpperCase() || ''}
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          '@media (max-width:340px)': {
                            width: '100%'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'flex-start',
                            '& svg': {
                              flexShrink: 0,
                              width: 24,
                              height: 24
                            },
                            marginBottom: '8px'
                          }}
                        >
                          <Store />
                          <Typography
                            variant="h3"
                            sx={{
                              ...singleLineEllipsisSx,
                              cursor: sellerData?._id ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                              if (!sellerData?._id) return;
                              navigate(`/shop/${slugOrId(sellerData)}`);
                            }}
                          >
                            {sellerData?.shopName || sellerData?.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0
                          }}
                        >
                          <Typography
                            variant="button"
                            sx={singleLineEllipsisSx}
                          >
                            {sellerData?.name} {sellerData?.lastname}
                          </Typography>
                          <Typography
                            variant="button"
                            sx={singleLineEllipsisSx}
                          >
                            {t('productPage.memberSince')}{' '}
                            {dayjs(sellerData?.createdAt).format('DD/MM/YYYY')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& svg': {
                          flexShrink: 0
                        },
                        gap: '8px'
                      }}
                    >
                      {sellerData?.phone && (
                        <Box
                          component="a"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0,
                            fontSize: '14px',
                            [theme.breakpoints.down('sm')]: {
                              fontSize: '12px'
                            },
                            gap: '8px',
                            color: '#266041',
                            textDecoration: 'none',
                            '&:hover': {
                              color: '#316357',
                              textDecoration: 'none',
                              transition: 'color 0.3s ease'
                            }
                          }}
                          href={`tel:${sellerData?.phone}`}
                        >
                          <Phone />
                          <Box component="span" sx={singleLineEllipsisSx}>
                            {sellerData?.phone}
                          </Box>
                        </Box>
                      )}
                      {sellerData?.email && (
                        <Box
                          component="a"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0,
                            fontSize: '14px',
                            [theme.breakpoints.down('sm')]: {
                              fontSize: '12px'
                            },
                            gap: '8px',
                            color: '#266041',
                            textDecoration: 'none',
                            '&:hover': {
                              color: '#316357',
                              textDecoration: 'none',
                              transition: 'color 0.3s ease'
                            }
                          }}
                          href={`mailto:${sellerData?.email}`}
                        >
                          <Mail />
                          <Box component="span" sx={singleLineEllipsisSx}>
                            {sellerData?.email}
                          </Box>
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
                          onClick={() =>
                            navigate('/shop/' + slugOrId(sellerData))
                          }
                        >
                          {t('productPage.profile')}
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
                            {t('productPage.navigation')}
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
                  <Tooltip
                    title={
                      !isUserLoggedIn
                        ? t('productPage.mustLoginToMessage')
                        : userId === sellerData?._id
                          ? t('productPage.cannotMessageSelf')
                          : ''
                    }
                    disableHoverListener={
                      isUserLoggedIn && userId !== sellerData?._id
                    }
                  >
                    <span style={{ width: '100%' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ width: '100%' }}
                        disabled={!isUserLoggedIn || userId === sellerData?._id}
                        title={
                          !isUserLoggedIn
                            ? t('productPage.mustLoginToMessage')
                            : userId === sellerData?._id
                              ? t('productPage.cannotMessageSelf')
                              : undefined
                        }
                        onClick={() => setOpenSendMessageDialog(true)}
                      >
                        {t('productPage.sendMessage')}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(`/order-product/${productId}`)}
                  >
                    {t('productPage.orderProduct')}
                  </Button>
                </Box>
                <Box
                  sx={(theme) => ({
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: 1.25,
                    my: 3,
                    [theme.breakpoints.up('sm')]: {
                      alignItems: 'center',
                      flexDirection: 'row'
                    }
                  })}
                >
                  <VoteButtons
                    likes={productData?.likes}
                    dislikes={productData?.dislikes}
                    onVote={handleProductVote}
                  />
                  <CopyLinkButton
                    successMessage={t('productPage.linkCopied')}
                    errorMessage={t('productPage.linkCopyFailed')}
                  />
                  <BookmarkButton />
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

            <Card sx={{ mt: 4, p: 2 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                {t('productPage.leaveReview')}
              </Typography>
              <ProductReviewForm
                onSubmit={handleAddReview}
                disableSubmit={
                  !isUserLoggedIn || isOwnProduct || hasUserReviewed
                }
                disableReason={reviewDisabledReason}
              />
              <ProductReviewList
                comments={productData?.comments || []}
                canReply={isUserLoggedIn && !isOwnProduct}
                replyDisabledReason={reviewDisabledReason}
                onReply={handleAddReview}
              />
            </Card>
          </Box>
        )}
        <ProductSection
          title={t('productPage.allSellerProducts')}
          products={sellerProducts}
        />
        <ProductSection
          title={t('productPage.productsFromGroup', {
            group: getLocalizedGroupLabel(
              productData?.group || '',
              i18n.language
            )
          })}
          products={groupProducts}
        />
      </Box>
      <SendMessageDialog
        open={openSendMessageDialog}
        onClose={() => setOpenSendMessageDialog(false)}
        userId={sellerData?._id || ''}
      />
    </PageContent>
  );
};
