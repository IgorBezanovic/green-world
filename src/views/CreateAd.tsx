import { EuroOutlined, SignatureOutlined } from '@ant-design/icons';
import { BackButton } from '@green-world/components';
import { groupItemsCreateAd } from '@green-world/utils/constants';
import { AdValues } from '@green-world/utils/types';
import { MenuProps, Space, Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import clsx from 'clsx';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const CreateAd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<AdValues>({
    group: '',
    subGroup: '',
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    price: ''
  });

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(!isOpen);
    console.log('click left button', e);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setProduct({ ...product, group: e.key });
    setIsOpen(!isOpen);
  };

  const menuProps = {
    items: groupItemsCreateAd,
    onClick: handleMenuClick
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Kreiraj oglas</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/create-ad" />
      </Helmet>
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
        <BackButton />
        <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl', 'md:mt-4')}>
          <strong>Kreirajte svoj proizvod</strong>
        </h1>
        <form className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}>
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
              Odaberite pripadajuću grupu:
            </label>
            <Space wrap>
              <Dropdown.Button
                menu={menuProps}
                open={isOpen}
                onClick={handleButtonClick}
                arrow={true}
              >
                {product.group
                  ? (
                      groupItemsCreateAd?.find(
                        (item: ItemType) => item && item.key === product.group
                      ) as { label: string }
                    )?.label
                  : 'Odaberite grupu'}
              </Dropdown.Button>
            </Space>
            <label
              htmlFor="title"
              className={clsx(
                'mt-4',
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Odaberite pripadajuću podgrupu:
            </label>
            <Space wrap>
              <Dropdown.Button
                menu={menuProps}
                open={isOpen}
                onClick={handleButtonClick}
                arrow={true}
              >
                {product.group
                  ? (
                      groupItemsCreateAd?.find(
                        (item: ItemType) => item && item.key === product.group
                      ) as { label: string }
                    )?.label
                  : 'Odaberite podgrupu'}
              </Dropdown.Button>
            </Space>
            <label
              htmlFor="title"
              className={clsx(
                'mt-4',
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
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
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
              htmlFor="kratakOpisProizvoda"
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
                name="kratakOpisProizvoda"
                id="kratakOpisProizvoda"
                placeholder="Unesite kratak opis proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
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
          </div>
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="opisProizvoda"
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
                name="opisProizvoda"
                id="opisProizvoda"
                placeholder="Unesite opis proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
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
              htmlFor="cenaProizvoda"
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
                name="cenaProizvoda"
                id="cenaProizvoda"
                placeholder="Unesite cenu proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <EuroOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <button
              type="submit"
              className={clsx(
                'mt-4',
                'w-full',
                'rounded',
                'py-2',
                'shadow-md',
                'text-mintCream',
                'transition-all',
                'flex',
                'justify-center',
                'items-center',
                'bg-forestGreen'
              )}
            >
              Kreiraj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
