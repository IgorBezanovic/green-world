import { LoadingOutlined, SignatureOutlined } from '@ant-design/icons';
import { BackButton } from '@green-world/components';
import { useEditUser } from '@green-world/hooks/useEditUser';
import { useUser } from '@green-world/hooks/useUser';
import { User } from '@green-world/utils/types';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const EditProfile = () => {
  const { data, isLoading } = useUser();
  const { mutate, isLoading: isLoadingUser } = useEditUser();

  const [user, setUser] = useState<User>({
    email: '',
    name: '',
    lastname: '',
    coverImage: '',
    profileImage: '',
    shopName: '',
    phone: '',
    address: {
      street: '',
      zipCode: 0,
      city: '',
      country: ''
    },
    shopDescription: '',
    website: '',
    onlyOnline: false,
    onlyOnThisSite: false
  });

  useEffect(() => {
    if (data) {
      setUser({
        ...user,
        email: data?.email,
        name: data?.name,
        lastname: data?.lastname,
        shopName: data?.shopName,
        phone: data?.phone,
        address: data?.address,
        shopDescription: data?.shopDescription,
        website: data?.website,
        onlyOnline: data?.onlyOnline,
        onlyOnThisSite: data?.onlyOnThisSite
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      address: {
        ...user.address,
        [name]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(user);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Azuriraj profil</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/edit-profile" />
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
            Azurirajte profil
          </h1>
        </section>
        <form
          className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}
          onSubmit={handleSubmit}
        >
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="shopName"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Naziv Vaseg biznisa:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="shopName"
                id="shopName"
                value={user?.shopName || ''}
                onChange={handleChange}
                placeholder="Unesite naziv Vaseg biznisa"
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
              htmlFor="name"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vase ime:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="name"
                id="name"
                value={user?.name || ''}
                onChange={handleChange}
                placeholder="Unesite Vase ime"
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
              htmlFor="lastname"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vase prezime:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="lastname"
                id="lastname"
                value={user?.lastname || ''}
                onChange={handleChange}
                placeholder="Unesite Vase prezime"
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
              htmlFor="mail"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vas email:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="email"
                id="mail"
                value={user?.email || ''}
                disabled
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
              htmlFor="shopDescription"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Opisite Vas biznis ili unesite viziju ili slogan:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <textarea
                required
                name="shopDescription"
                id="shopDescription"
                value={user?.shopDescription || ''}
                onChange={handleChange}
                placeholder="Unesite opis"
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
              htmlFor="website"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Website vase radnje:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="website"
                id="website"
                value={user?.website || ''}
                onChange={handleChange}
                placeholder="Unesite URL vase radnje"
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
              htmlFor="phone"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Kontakt telefon:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="phone"
                id="phone"
                value={user?.phone || ''}
                onChange={handleChange}
                placeholder="Unesite Vas kontakt telefon"
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
            <div className={clsx('flex', 'w-full', 'gap-4')}>
              <div className={clsx('w-full')}>
                <label
                  htmlFor="zipCode"
                  className={clsx(
                    'flex',
                    'mb-2',
                    'text-forestGreen',
                    'cursor-pointer',
                    'text-lg'
                  )}
                >
                  Poštanski broj:
                </label>
                <div className={clsx('w-full', 'relative')}>
                  <input
                    required
                    type="string"
                    name="zipCode"
                    id="zipCode"
                    value={user?.address?.zipCode || ''}
                    onChange={handleAddressChange}
                    placeholder="Unesite poštanski broj"
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
              <div className={clsx('w-full')}>
                <label
                  htmlFor="city"
                  className={clsx(
                    'flex',
                    'mb-2',
                    'text-forestGreen',
                    'cursor-pointer',
                    'text-lg'
                  )}
                >
                  Grad:
                </label>
                <div className={clsx('w-full', 'relative')}>
                  <input
                    required
                    type="text"
                    name="city"
                    id="city"
                    value={user?.address?.city || ''}
                    onChange={handleAddressChange}
                    placeholder="Unesite grad"
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
            </div>
            <label
              htmlFor="street"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Ulica:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="street"
                id="street"
                value={user?.address?.street || ''}
                onChange={handleAddressChange}
                placeholder="Unesite ulicu"
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
              htmlFor="country"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Država:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="country"
                id="country"
                value={user?.address?.country || ''}
                onChange={handleAddressChange}
                placeholder="Unesite državu"
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
              htmlFor="onlyOnline"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Radite samo online?
            </label>
            <div
              className={clsx('w-full', 'relative', 'mb-4', 'flex', 'gap-4')}
            >
              <div>
                <input
                  type="radio"
                  name="onlyOnline"
                  id="onlyOnlineYes"
                  value="true"
                  checked={user?.onlyOnline === true}
                  onChange={() => setUser({ ...user, onlyOnline: true })}
                  className={clsx('mr-2')}
                />
                <span>Da</span>
              </div>
              <div>
                <input
                  type="radio"
                  name="onlyOnline"
                  id="onlyOnlineNo"
                  value="false"
                  checked={user?.onlyOnline === false}
                  onChange={() => setUser({ ...user, onlyOnline: false })}
                  className={clsx('mr-2')}
                />
                <span>Ne</span>
              </div>
            </div>
            <label
              htmlFor="onlyOnThisSite"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Poslujete samo preko ovog sajta?
            </label>
            <div
              className={clsx('w-full', 'relative', 'mb-1', 'flex', 'gap-4')}
            >
              <div>
                <input
                  type="radio"
                  name="onlyOnThisSite"
                  id="onlyOnThisSiteYes"
                  value="true"
                  checked={user?.onlyOnThisSite === true}
                  onChange={() => setUser({ ...user, onlyOnThisSite: true })}
                  className={clsx('mr-2')}
                />
                <span>Da</span>
              </div>
              <div>
                <input
                  type="radio"
                  name="onlyOnThisSite"
                  id="onlyOnThisSiteNo"
                  value="false"
                  checked={user?.onlyOnThisSite === false}
                  onChange={() => setUser({ ...user, onlyOnThisSite: false })}
                  className={clsx('mr-2')}
                />
                <span>Ne</span>
              </div>
            </div>
            <button
              type="submit"
              className={clsx(
                'mt-6',
                'w-full',
                'rounded',
                'py-2',
                'shadow-md',
                'text-mintCream',
                'transition-all',
                'flex',
                'justify-center',
                'items-center',
                {
                  'bg-forestGreen': !isLoadingUser,
                  'bg-groupTransparent': isLoadingUser
                }
              )}
              disabled={isLoadingUser}
            >
              {isLoadingUser ? (
                <LoadingOutlined className={clsx('text-whiteLinen', 'my-2')} />
              ) : (
                'Azuriraj profil'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
