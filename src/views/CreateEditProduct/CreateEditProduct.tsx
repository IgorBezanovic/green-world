import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  AppBreadcrumbs,
  CustomButton,
  CustomInput,
  MetaTags
} from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useImage } from '@green-world/hooks/useImage';
import { useProduct } from '@green-world/hooks/useProduct';
import {
  groupItemsCreateProduct,
  subGroups
} from '@green-world/utils/constants';
import { Product, SubGroup, SubGroupKeys } from '@green-world/utils/types';
import {
  Alert,
  AlertTitle,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Snackbar
} from '@mui/material';
import { Select, message } from 'antd';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { useParams } from 'react-router';

import 'react-quill-new/dist/quill.snow.css';
import { AiButton } from './component';

const initProduct: Product = {
  _id: '',
  group: '',
  subGroup: '',
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  price: 0,
  priceOnRequest: false,
  height: 0,
  width: 0,
  weight: 0,
  milliliters: 0,
  createdBy: '',
  status: '',
  onStock: true
};

const MAX_IMAGE_MB = 10 * 1024 * 1024;

export const CreateEditProduct = () => {
  const { productId = '' } = useParams();
  const { data = initProduct, isLoading } = useProduct(productId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const quillRef = useRef<ReactQuill>(null);
  const modules = {
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
      'blockquote',
      { script: 'sub' },
      { script: 'super' }
    ]
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const {
    mutate: imageMutate,
    isPending: isImageLoading,
    data: productImage
  } = useImage();

  const { mutate: createMutation, isPending: isLoadingCreateProduct } =
    useCreateProduct();

  const { mutate: editMutation, isPending: isLoadingEditProduct } =
    useEditProduct(productId);

  const [product, setProduct] = useState<Product>(initProduct);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCheckboxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setProduct({
      ...product,
      priceOnRequest: checked
    });
  };

  useEffect(() => {
    if (!isLoading) {
      setProduct(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: productImage
        ? [...(prevProduct?.images || []), productImage]
        : prevProduct?.images || []
    }));
  }, [productImage]);

  const handleGroupChange = (e: string) => {
    setProduct({ ...product, group: e });
  };

  const handleSubGroupChange = (e: string) => {
    setProduct({ ...product, subGroup: e });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files!)[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_MB) {
      setSnackbarOpen(true);
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
    e.target.value = '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    productId ? editMutation(product) : createMutation(product);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const updatedImages = product?.images.filter(
      (_, index) => index !== indexToDelete
    );

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages
    }));
  };

  const handleRichTextDescription = (richText: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: richText
    }));
  };

  const handleSetAsProfileImage = (index: number) => {
    setProduct((prevProduct) => {
      if (index === 0) return prevProduct;

      const updatedImages = [...prevProduct.images];
      const selectedImage = updatedImages.splice(index, 1)[0];
      updatedImages.unshift(selectedImage);
      return {
        ...prevProduct,
        images: updatedImages
      };
    });
  };

  const canGenerate =
    (product?.title?.trim()?.length ?? 0) > 2 &&
    (product?.images?.length ?? 0) > 0 &&
    keywords.length >= 2 &&
    keywords.length <= 10;

  const handleGenerateAiDescription = async () => {
    try {
      setIsAiLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(baseUrl + '/ai/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          keywords,
          images: product.images,
          context: {
            group: product.group,
            subGroup: product.subGroup
          }
        })
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Greška' }));
        throw new Error(error || 'Greška pri generisanju opisa.');
      }

      const { descriptionHtml } = await res.json();
      handleRichTextDescription(descriptionHtml);
      message.success('AI opis generisan ✅');
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || 'Nije uspelo generisanje opisa.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined className="text-forestGreen text-4xl" />
      </div>
    );
  }

  const pageTitle = `Zeleni svet | ${productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}`;
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Korisnički profil', route: '/profile' },
    {
      label: `${productId ? 'Ažuriraj' : 'Kreiraj'} proizvod`,
      route: `/${productId ? 'edit' : 'create'}-product`
    }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={pageTitle} />
      <title>
        Zeleni svet | {productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}
      </title>
      <link rel="canonical" href="https://www.zelenisvet.rs/create-product" />

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
        <h1
          className={clsx(
            'text-forestGreen',
            'text-5xl',
            'md:text-6xl',
            'font-ephesis',
            'mx-auto'
          )}
        >
          {productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}
        </h1>
        <form
          className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}
          onSubmit={handleSubmit}
        >
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="group"
              className={clsx('mb-2', 'text-forestGreen', 'text-lg')}
            >
              Odaberite pripadajuću grupu:
            </label>
            <Select
              value={product.group || 'Odaberi grupu proizvoda'}
              className={clsx('shadow-md', 'md:hover:shadow-lg')}
              onChange={handleGroupChange}
              options={groupItemsCreateProduct!.map((item) => ({
                value: item?.key,
                label: (item as { label: string }).label
              }))}
            />
            <label
              htmlFor="subGroup"
              className={clsx('mt-4', 'mb-2', 'text-forestGreen', 'text-lg')}
            >
              Odaberite pripadajuću podgrupu:
            </label>
            <Select
              value={product.subGroup || 'Odaberi podgrupu proizvoda'}
              className={clsx('shadow-md', 'md:hover:shadow-lg')}
              onChange={handleSubGroupChange}
              options={subGroups[
                (product.group as SubGroupKeys) || 'flower_assortment'
              ]!.map((item: SubGroup) => ({
                value: item?.label,
                label: item?.sr_RS
              }))}
            />
            <label
              htmlFor={
                product?.images?.length >= 10 ? undefined : 'profileImage'
              }
              className={clsx(
                'mt-4',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Dodajte fotografije proizvoda:
            </label>
            {Boolean(product?.images.length) && (
              <div
                className={clsx(
                  'w-full',
                  'min-h-20',
                  'mb-4',
                  'gap-4',
                  'rounded',
                  'shadow-md',
                  'p-4',
                  'grid',
                  'grid-cols-2',
                  'md:grid-cols-4',
                  'border',
                  'border-forestGreen'
                )}
              >
                {product?.images?.map((image, index) => (
                  <div key={index} className={clsx('w-full', 'relative')}>
                    <DeleteOutlined
                      className={clsx(
                        'absolute',
                        'top-2',
                        'right-2',
                        'font-2xl',
                        'text-forestGreen'
                      )}
                      onClick={() => handleDeleteImage(index)}
                      alt="Obrisi sliku"
                      title="Obrisi sliku"
                    />
                    <img
                      src={image}
                      alt={`product-image-${index}`}
                      className={clsx('aspect-square', 'shadow-md')}
                      height="100%"
                      width="100%"
                    />
                    {index !== 0 && (
                      <button
                        onClick={() => handleSetAsProfileImage(index)}
                        className={clsx(
                          'mt-2',
                          'px-3',
                          'py-1',
                          'w-full',
                          'text-sm',
                          'font-semibold',
                          'text-white',
                          'bg-forestGreen',
                          'rounded-full',
                          'shadow-md',
                          'transition-all',
                          'md:hover:text-cream',
                          'md:hover:shadow-lg',
                          'md:hover:translate-y-[-1px]'
                        )}
                      >
                        <small>Profilna</small>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <label
              htmlFor={
                product?.images?.length >= 10 ? undefined : 'profileImage'
              }
              className={clsx(
                'border',
                product?.images?.length >= 10
                  ? 'border-gray40 text-gray40 bg-gray10 cursor-not-allowed'
                  : 'border-forestGreen text-forestGreen bg-whiteLinen cursor-pointer md:hover:text-black md:hover:shadow-lg md:hover:translate-y-[-1px] md:active:translate-y-0 md:active:shadow-md',
                'rounded',
                'py-2',
                'px-4',
                'shadow-md',
                'text-center',
                'mx-auto',
                'md:mx-0',
                'uppercase',
                'font-light',
                'mb-4',
                'md:mb-0',
                'transition-all',
                'duration-300',
                {
                  'mt-4': Boolean(!product?.images.length),
                  'mb-8': Boolean(!product?.images.length)
                }
              )}
              aria-disabled={product?.images?.length >= 10}
            >
              {product?.images?.length >= 10
                ? 'Maksimalno 10 slika'
                : 'Dodaj sliku proizvoda'}
            </label>
            <input
              type="file"
              disabled={product?.images?.length >= 10}
              name="profileImage"
              id="profileImage"
              accept="image/*"
              onChange={handleImage}
              className={clsx('hidden')}
              data-max-size={MAX_IMAGE_MB}
            />
            <Alert severity="info" className="mt-4">
              <AlertTitle>Informacije o dodavanju fotografija</AlertTitle>
              <List sx={{ pl: 3, listStyleType: 'disc' }}>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Idealna razmera za fotografije 1/1 square." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Prva slika u nizu je profilna." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Maksimum 10 fotografija." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Jedna fotografija maximum 10MB." />
                </ListItem>
              </List>
            </Alert>
          </div>

          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Naziv proizvoda:
            </label>
            <CustomInput
              required
              type="text"
              name="title"
              id="title"
              placeholder="Unesite naziv proizvoda"
              value={product?.title || ''}
              onChange={handleChange}
            />

            <label
              className={clsx('mb-2', 'mt-4', 'text-forestGreen', 'text-lg')}
            >
              Ključne fraze za generisanje (min 2 / max 10):
            </label>
            <Select
              mode="tags"
              value={keywords}
              onChange={(vals) => {
                const cleaned = (vals as string[])
                  .map((v) => v.trim())
                  .filter(Boolean)
                  .slice(0, 10);
                setKeywords(cleaned);
              }}
              tokenSeparators={[',']}
              placeholder="Dodaj ključne fraze (ENTER ili ,)"
              className={clsx('shadow-md', 'md:hover:shadow-lg', 'mb-1')}
            />
            <small className={clsx('text-gray40', 'italic', 'mb-2')}>
              Koristi pojmove iz baštovanstva: npr. saksija, supstrat, đubrivo,
              fikus, zalivanje…
            </small>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-3 mb-2">
              <label
                htmlFor="description"
                className={clsx(
                  'text-forestGreen',
                  'cursor-pointer',
                  'text-lg',
                  'm-0'
                )}
              >
                Opis proizvoda:
              </label>
              <AiButton
                isAiLoading={isAiLoading}
                canGenerate={canGenerate}
                onClick={handleGenerateAiDescription}
              />
            </div>

            <div className={clsx('mb-4')}>
              <ReactQuill
                ref={quillRef}
                modules={modules}
                value={product?.description || ''}
                onChange={handleRichTextDescription}
                id="description"
                theme="snow"
                style={{ minHeight: 200 }}
              />
              <style>
                {`
                .ql-toolbar.ql-snow{
                  border-top-left-radius: 0.375rem;
                  border-top-right-radius: 0.375rem;
                  /* Remove shadow below the bottom border */
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
                `}
              </style>
            </div>

            <label
              htmlFor="shortDescription"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Kratak opis proizvoda:{' '}
              <small className={clsx('text-gray40', 'italic')}>
                max 80 karaktera
              </small>
            </label>
            <CustomInput
              name="shortDescription"
              id="shortDescription"
              maxLength={80}
              className={clsx(
                'flex-1',
                'rounded-xs',
                'shadow-md',
                'h-full',
                'min-h-[42px]',
                'md:hover:shadow-lg',
                {
                  'border-forestGreen': !isLoading,
                  'border-groupTransparent': isLoading
                }
              )}
              placeholder="Unesite kratak opis proizvoda"
              value={product?.shortDescription || ''}
              onChange={handleChange}
            />
            <small className={clsx('text-gray40', 'italic', 'mb-4')}>
              Opis se prikazuje na početnoj stranici
            </small>

            <label
              htmlFor="price"
              className={clsx('text-forestGreen', 'cursor-pointer', 'text-lg')}
            >
              Cena proizvoda:
            </label>
            <small className={clsx('mb-2', 'text-gray40', 'italic')}>
              Cenu proizvoda unesite bez tacki i zareza, na nama je da
              formatiramo. e.g. 1490 - 1.490,00 RSD
            </small>
            <CustomInput
              required
              type="text"
              name="price"
              id="price"
              placeholder="Unesite cenu proizvoda"
              value={product?.price || ''}
              onChange={handleChange}
              disabled={product?.priceOnRequest}
            />
            <div className="flex items-center mt-2 mb-4">
              <Checkbox
                checked={product?.priceOnRequest ?? false}
                onChange={handleCheckboxPrice}
                color="success"
                id="priceOnRequest"
              />
              <label
                htmlFor="priceOnRequest"
                className="text-forestGreen text-md"
              >
                Cena: <strong>Na upit</strong>
              </label>
            </div>

            <label
              htmlFor="height"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Visina proizvoda:
            </label>
            <CustomInput
              type="text"
              name="height"
              id="height"
              placeholder="Unesite visinu proizvoda"
              value={product?.height || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="width"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Sirina proizvoda:
            </label>
            <CustomInput
              type="text"
              name="width"
              id="width"
              placeholder="Unesite sirinu proizvoda"
              value={product?.width || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="weight"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Tezina proizvoda:
            </label>
            <CustomInput
              type="text"
              name="weight"
              id="weight"
              placeholder="Unesite tezinu proizvoda"
              value={product?.weight || ''}
              onChange={handleChange}
            />
            <label
              htmlFor="milliliters"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Koliko millilitara:
            </label>
            <CustomInput
              type="text"
              name="milliliters"
              id="milliliters"
              placeholder="Unesite Mililitre"
              value={product?.milliliters || ''}
              onChange={handleChange}
            />

            <CustomButton
              htmlType="submit"
              type="text"
              text={
                isLoading ||
                isImageLoading ||
                isLoadingCreateProduct ||
                isLoadingEditProduct ? (
                  <LoadingOutlined
                    className={clsx('text-groupTransparent', 'my-2')}
                  />
                ) : productId ? (
                  'Azuriraj proizvod'
                ) : (
                  'Kreiraj proizvod'
                )
              }
              customStyle={[
                'mt-6',
                {
                  'border-groupTransparent': isLoading || isImageLoading
                }
              ]}
              disabled={isLoading || isImageLoading}
            />
          </div>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Maksimalna veličina fajla je 10MB!
        </Alert>
      </Snackbar>
    </div>
  );
};
