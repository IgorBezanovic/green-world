import { LoadingOutlined } from '@ant-design/icons';
import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import clsx from 'clsx';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';

import { CustomInput, CustomButton } from '.';

export const EditUserData = () => {
  const { user, setUser, isLoading } = useContext(UserContext);
  const { mutate, isLoading: isLoadingUser } = useEditUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(user);
  };

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}
      onSubmit={handleSubmit}
    >
      <Helmet>
        <title>Zeleni svet | Podešavanje profila</title>
        <link
          rel="canonical"
          href="https://www.zeleni-svet.com/profile-settings/edit-profile"
        />
      </Helmet>
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
        <CustomInput
          required
          type="text"
          name="shopName"
          id="shopName"
          value={user?.shopName || ''}
          onChange={handleChange}
          placeholder="Unesite naziv Vaseg biznisa"
        />
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
        <CustomInput
          required
          type="text"
          name="name"
          id="name"
          value={user?.name || ''}
          onChange={handleChange}
          placeholder="Unesite Vase ime"
        />
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
        <CustomInput
          required
          type="text"
          name="lastname"
          id="lastname"
          value={user?.lastname || ''}
          onChange={handleChange}
          placeholder="Unesite Vase prezime"
        />
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
        <CustomInput
          required
          type="text"
          name="email"
          id="mail"
          value={user?.email || ''}
          disabled
        />
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
        <textarea
          required
          name="shopDescription"
          id="shopDescription"
          value={user?.shopDescription || ''}
          onChange={handleChange}
          placeholder="Unesite opis"
          className={clsx(
            'w-full',
            'border',
            'border-forestGreen',
            'rounded',
            'p-2',
            'pl-3',
            'shadow-md',
            'mb-4',
            'bg-whiteLinen'
          )}
        />
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
        <CustomInput
          required
          type="text"
          name="website"
          id="website"
          value={user?.website || ''}
          onChange={handleChange}
          placeholder="Unesite URL vase radnje"
        />
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
        <CustomInput
          type="text"
          name="phone"
          id="phone"
          value={user?.phone || ''}
          onChange={handleChange}
          placeholder="Unesite Vas kontakt telefon"
        />
        <label
          htmlFor="zipCode"
          className={clsx(
            'flex',
            'flex-1',
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Poštanski broj:
        </label>
        <CustomInput
          type="string"
          name="zipCode"
          id="zipCode"
          value={user?.address?.zipCode || ''}
          onChange={handleAddressChange}
          placeholder="Unesite poštanski broj"
          customStyle={'!flex-grow-0'}
        />
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
        <CustomInput
          type="text"
          name="city"
          id="city"
          value={user?.address?.city || ''}
          onChange={handleAddressChange}
          placeholder="Unesite grad"
          customStyle={'!flex-grow-0'}
        />
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
        <CustomInput
          type="text"
          name="street"
          id="street"
          value={user?.address?.street || ''}
          onChange={handleAddressChange}
          placeholder="Unesite ulicu"
        />
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
        <CustomInput
          required
          type="text"
          name="country"
          id="country"
          value={user?.address?.country || ''}
          onChange={handleAddressChange}
          placeholder="Unesite državu"
        />
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
        <div className={clsx('w-full', 'relative', 'mb-4', 'flex', 'gap-4')}>
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
        <div className={clsx('w-full', 'relative', 'mb-1', 'flex', 'gap-4')}>
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
        <CustomButton
          htmlType="submit"
          type="text"
          text={
            isLoadingUser ? (
              <LoadingOutlined
                className={clsx('text-groupTransparent', 'my-2')}
              />
            ) : (
              'Azuriraj profil'
            )
          }
          customStyle={[
            'mt-2',
            {
              'border-groupTransparent': isLoadingUser
            }
          ]}
          disabled={isLoadingUser}
        />
      </div>
    </form>
  );
};
