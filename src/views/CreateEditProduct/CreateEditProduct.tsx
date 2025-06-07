import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { BackButton, CustomButton, CustomInput } from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useImage } from '@green-world/hooks/useImage';
import { useProduct } from '@green-world/hooks/useProduct';
import {
  groupItemsCreateProduct,
  subGroups
} from '@green-world/utils/constants';
import { Product, SubGroup, SubGroupKeys } from '@green-world/utils/types';
import { Select } from 'antd';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactQuill from 'react-quill-new';
import { useParams } from 'react-router-dom';
import 'react-quill-new/dist/quill.snow.css';

const initProduct: Product = {
  group: '',
  subGroup: '',
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  price: 0,
  height: 0,
  width: 0,
  weight: 0,
  milliliters: 0,
  createdBy: '',
  status: '',
  onStock: true
};

export const CreateEditProduct = () => {
  const { productId = '' } = useParams();
  const { data = initProduct, isLoading } = useProduct(productId);
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

  const {
    mutate: imageMutate,
    isLoading: isImageLoading,
    data: productImage
  } = useImage();

  const { mutate: createMutation, isLoading: isLoadingCreateProduct } =
    useCreateProduct();

  const { mutate: editMutation, isLoading: isLoadingEditProduct } =
    useEditProduct(productId);

  const [product, setProduct] = useState<Product>(initProduct);

  useEffect(() => {
    if (!isLoading) {
      setProduct(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: productImage
        ? [...prevProduct.images, productImage]
        : prevProduct.images
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

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
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
    const updatedImages = product.images.filter(
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined className="text-forestGreen text-4xl" />
      </div>
    );
  }

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>
          Zeleni svet | {productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}
        </title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/create-product"
        />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-10',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <section
          className={clsx(
            'flex',
            'items-center',
            'w-full',
            'justify-center',
            'relative',
            'mb-4'
          )}
        >
          <div className={clsx('hidden', 'md:flex', 'absolute', 'left-0')}>
            <BackButton />
          </div>
          <h1
            className={clsx('text-forestGreen', 'text-5xl', 'md:text-6xl')}
            style={{ fontFamily: 'GreenWorld' }}
          >
            {productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}
          </h1>
        </section>
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
            {product.group && (
              <React.Fragment>
                <label
                  htmlFor="subGroup"
                  className={clsx(
                    'mt-4',
                    'mb-2',
                    'text-forestGreen',
                    'text-lg'
                  )}
                >
                  Odaberite pripadajuću podgrupu:
                </label>
                <Select
                  value={product.subGroup || 'Odaberi podgrupu proizvoda'}
                  className={clsx('shadow-md', 'md:hover:shadow-lg')}
                  onChange={handleSubGroupChange}
                  options={subGroups[product.group as SubGroupKeys]!.map(
                    (item: SubGroup) => ({
                      value: item?.label,
                      label: item?.sr_RS
                    })
                  )}
                />
              </React.Fragment>
            )}
            <label
              htmlFor="title"
              className={clsx(
                'mt-4',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Dodajte fotografije proizvoda:
            </label>
            <small className={clsx('mb-2')}>Maksimum 10 fotografija</small>
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
                'md:grid-cols-4'
              )}
            >
              {product?.images.map((image, index) => (
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
            <small className={clsx('text-gray40', 'italic', 'mb-4')}>
              Prva slika u nizu je profilna
            </small>
            {product?.images.length < 10 && (
              <>
                <label
                  htmlFor="profileImage"
                  className={clsx(
                    'border',
                    'border-forestGreen',
                    'text-forestGreen',
                    'rounded',
                    'py-2',
                    'px-4',
                    'shadow-md',
                    'bg-whiteLinen',
                    'text-center',
                    'cursor-pointer',
                    'mx-auto',
                    'md:mx-0',
                    'uppercase',
                    'font-light',
                    'mb-4',
                    'md:mb-0',
                    'transition-all',
                    'duration-300',
                    'md:hover:text-black',
                    'md:hover:shadow-lg',
                    'md:hover:translate-y-[-1px]',
                    'md:active:translate-y-0',
                    'md:active:shadow-md'
                  )}
                >
                  Dodaj sliku proizvoda
                </label>
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImage}
                  className={clsx('hidden')}
                ></input>
              </>
            )}
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
              htmlFor="description"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Opis proizvoda:
            </label>
            <div className={clsx('mb-4')}>
              <ReactQuill
                ref={quillRef}
                modules={modules}
                value={product?.description || ''}
                onChange={handleRichTextDescription}
                id="description"
                theme="snow"
              />
            </div>
            <label
              htmlFor="price"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Cena proizvoda:
            </label>
            <CustomInput
              required
              type="text"
              name="price"
              id="price"
              placeholder="Unesite cenu proizvoda"
              value={product?.price || ''}
              onChange={handleChange}
            />
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
    </div>
  );
};
