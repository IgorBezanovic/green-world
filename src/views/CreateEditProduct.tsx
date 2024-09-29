import {
  DeleteOutlined,
  LoadingOutlined,
  SignatureOutlined
} from '@ant-design/icons';
import { BackButton, CustomButton } from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useImage } from '@green-world/hooks/useImage';
import { useProduct } from '@green-world/hooks/useProduct';
import { groupItemsCreateProduct } from '@green-world/utils/constants';
import { ProductValues } from '@green-world/utils/types';
import { Radio } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

const initProduct = {
  group: '',
  subGroup: '',
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  price: '',
  height: 0,
  width: 0,
  weight: 0,
  milliliters: 0
};

export const CreateEditProduct = () => {
  const { productId = '' } = useParams();
  const { data = initProduct, isLoading } = useProduct(productId);

  const {
    mutate: imageMutate,
    isLoading: isImageLoading,
    data: productImage
  } = useImage();

  const { mutate: createMutation, isLoading: isLoadingCreateProduct } =
    useCreateProduct();

  const { mutate: editMutation, isLoading: isLoadingEditProduct } =
    useEditProduct(productId);

  const [product, setProduct] = useState<ProductValues>(initProduct);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...data,
      images: productImage ? [...prevProduct.images, productImage] : data.images
    }));
  }, [data, productImage]);

  const handleGroupChange = (e: any) => {
    setProduct({ ...product, group: e.target.value });
  };

  const handleSubGroupChange = (e: any) => {
    setProduct({ ...product, subGroup: e.target.value });
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

    setProduct({
      ...product,
      images: updatedImages
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
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
            <Radio.Group
              name="group"
              onChange={handleGroupChange}
              value={product.group}
            >
              {groupItemsCreateProduct!.map((item: any) => (
                <Radio key={item?.key} value={item?.key} name="group">
                  {item?.label}
                </Radio>
              ))}
            </Radio.Group>
            <label
              htmlFor="subGroup"
              className={clsx('mt-4', 'mb-2', 'text-forestGreen', 'text-lg')}
            >
              Odaberite pripadajuću podgrupu:
            </label>
            <Radio.Group
              name="subGroup"
              onChange={handleSubGroupChange}
              value={product.subGroup}
            >
              {groupItemsCreateProduct!.map((item: any) => (
                <Radio key={item?.key} value={item?.key} name="subGroup">
                  {item?.label}
                </Radio>
              ))}
            </Radio.Group>
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
                'bg-image-box-gradient',
                'gap-4',
                'rounded-md',
                'shadow-md',
                'border-2',
                'border-gray40',
                'p-4',
                'grid',
                'grid-cols-2',
                'md:grid-cols-4'
              )}
            >
              {product?.images.map((image, index) => (
                <div
                  key={index}
                  className={clsx(
                    'w-full',
                    'max-h-[150px]',
                    'overflow-hidden',
                    'shadow-md',
                    'relative'
                  )}
                >
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
                    height="100%"
                    width="100%"
                  />
                </div>
              ))}
            </div>
            {product?.images.length < 10 && (
              <>
                <label
                  htmlFor="profileImage"
                  className={clsx(
                    'border-2',
                    'border-forestGreen',
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
                    'font-extralight',
                    'mb-4',
                    'md:mb-0'
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
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite naziv proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.title || ''}
                onChange={handleChange}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
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
              Kratak opis proizvoda:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <textarea
                required
                name="shortDescription"
                id="shortDescription"
                placeholder="Unesite kratak opis proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.shortDescription || ''}
                onChange={handleChange}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
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
            <div className={clsx('w-full', 'relative')}>
              <textarea
                required
                name="description"
                id="description"
                placeholder="Unesite opis proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.description || ''}
                onChange={handleChange}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
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
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="price"
                id="price"
                placeholder="Unesite cenu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-12',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.price || ''}
                onChange={handleChange}
              />
              <span
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[10px]',
                  'font-extralight'
                )}
              >
                RSD
              </span>
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
            <div className={clsx('w-full', 'relative')}>
              <input
                type="text"
                name="height"
                id="height"
                placeholder="Unesite visinu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-12',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.height || ''}
                onChange={handleChange}
              />
              <span
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[10px]',
                  'font-extralight'
                )}
              >
                CM
              </span>
            </div>
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
            <div className={clsx('w-full', 'relative')}>
              <input
                type="text"
                name="width"
                id="width"
                placeholder="Unesite sirinu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-12',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.width || ''}
                onChange={handleChange}
              />
              <span
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[10px]',
                  'font-extralight'
                )}
              >
                CM
              </span>
            </div>
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
            <div className={clsx('w-full', 'relative')}>
              <input
                type="text"
                name="weight"
                id="weight"
                placeholder="Unesite tezinu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-12',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.weight || ''}
                onChange={handleChange}
              />
              <span
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[10px]',
                  'font-extralight'
                )}
              >
                KG
              </span>
            </div>
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
            <div className={clsx('w-full', 'relative')}>
              <input
                type="text"
                name="milliliters"
                id="milliliters"
                placeholder="Unesite cenu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-12',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
                value={product?.milliliters || ''}
                onChange={handleChange}
              />
              <span
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[10px]',
                  'font-extralight'
                )}
              >
                ML
              </span>
            </div>
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
