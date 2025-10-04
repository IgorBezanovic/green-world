import { LoadingOutlined } from '@ant-design/icons';
import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import { useContext, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

import { CustomInput, CustomButton } from '.';

export const EditUserData = () => {
  const { user, setUser, isLoading } = useContext(UserContext);
  const { mutate, isPending: isLoadingUser } = useEditUser();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  type SocialMediaKeys = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  const socialMediaRegex = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?$/,
    facebook: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._%-]+\/?$/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@?[A-Za-z0-9._%-]+\/?$/,
    linkedin:
      /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9._%-]+\/?$/
  };

  const handleBlurSocialMedia = (key: SocialMediaKeys) => {
    const value = user?.socialMedia?.[key] || '';
    const error = validateSocialMedia(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: error || undefined
    }));
  };

  const validateSocialMedia = (name: string, value: string) => {
    if (!value) return '';
    if (!socialMediaRegex[name as keyof typeof socialMediaRegex].test(value)) {
      return `Unesite validan ${name} URL.`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(user);
    setErrors({});
    toast.success('Uspešno ste editovali profil.');
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
      <title>Zeleni svet | Podešavanje profila</title>
      <link
        rel="canonical"
        href="https://www.zelenisvet.rs/profile-settings/edit-profile"
      />

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
          type="text"
          name="email"
          id="mail"
          value={user?.email || ''}
          disabled
        />
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
        <PhoneInput
          country="rs"
          value={user?.phone || ''}
          onChange={(value) => setUser({ ...user, phone: value })}
          inputStyle={{
            width: '100%',
            height: '42px',
            background: 'white',
            borderRadius: '6px',
            border: '1px solid #266041',
            boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)',
            paddingLeft: '55px'
          }}
          buttonStyle={{
            background: 'white',
            width: '50px',
            border: '1px solid #266041',
            borderRadius: '6px 0 0 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          containerStyle={{
            marginBottom: '16px'
          }}
          placeholder="+381 60 123 456 7"
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
          htmlFor="instagram"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Instagram:
        </label>
        <CustomInput
          type="text"
          name="instagram"
          id="instagram"
          value={user?.socialMedia?.instagram || ''}
          customStyle={errors.instagram ? '!border-red-500' : ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({
              ...user,
              socialMedia: {
                ...user.socialMedia,
                instagram: e.target.value
              }
            })
          }
          onBlur={() => handleBlurSocialMedia('instagram')}
          placeholder="Unesite Instagram profil (npr. https://instagram.com/vasprofil)"
        />
        {errors.instagram && (
          <Typography
            variant="caption"
            sx={{
              color: 'red',
              fontStyle: 'italic',
              marginTop: '-0.8rem'
            }}
          >
            {errors.instagram || ''}
          </Typography>
        )}
        <label
          htmlFor="facebook"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          Facebook:
        </label>
        <CustomInput
          type="text"
          name="facebook"
          id="facebook"
          value={user?.socialMedia?.facebook || ''}
          customStyle={errors.facebook ? '!border-red-500' : ''}
          onBlur={() => handleBlurSocialMedia('facebook')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({
              ...user,
              socialMedia: {
                ...user.socialMedia,
                facebook: e.target.value
              }
            })
          }
          placeholder="Unesite Facebook profil (npr. https://facebook.com/vasprofil)"
        />
        {errors.facebook && (
          <Typography
            variant="caption"
            sx={{
              color: 'red',
              fontStyle: 'italic',
              marginTop: '-0.8rem'
            }}
          >
            {errors.facebook || ''}
          </Typography>
        )}
        <label
          htmlFor="tiktok"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          TikTok:
        </label>
        <CustomInput
          type="text"
          name="tiktok"
          id="tiktok"
          value={user?.socialMedia?.tiktok || ''}
          customStyle={errors.tiktok ? '!border-red-500' : ''}
          onBlur={() => handleBlurSocialMedia('tiktok')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({
              ...user,
              socialMedia: {
                ...user.socialMedia,
                tiktok: e.target.value
              }
            })
          }
          placeholder="Unesite TikTok profil (npr. https://tiktok.com/@vasprofil)"
        />
        {errors.tiktok && (
          <Typography
            variant="caption"
            sx={{
              color: 'red',
              fontStyle: 'italic',
              marginTop: '-0.8rem'
            }}
          >
            {errors.tiktok || ''}
          </Typography>
        )}
        <label
          htmlFor="linkedin"
          className={clsx(
            'mb-2',
            'text-forestGreen',
            'cursor-pointer',
            'text-lg'
          )}
        >
          LinkedIn:
        </label>
        <CustomInput
          type="text"
          name="linkedin"
          id="linkedin"
          value={user?.socialMedia?.linkedin || ''}
          customStyle={errors.linkedin ? '!border-red-500' : ''}
          onBlur={() => handleBlurSocialMedia('linkedin')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({
              ...user,
              socialMedia: {
                ...user.socialMedia,
                linkedin: e.target.value
              }
            })
          }
          placeholder="Unesite LinkedIn profil (npr. https://linkedin.com/in/vasprofil)"
        />
        {errors.linkedin && (
          <Typography
            variant="caption"
            sx={{
              color: 'red',
              fontStyle: 'italic',
              marginTop: '-0.8rem'
            }}
          >
            {errors.linkedin || ''}
          </Typography>
        )}
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
              onChange={() =>
                setUser({
                  ...user,
                  onlyOnline: true,
                  address: {
                    zipCode: 0,
                    city: '',
                    street: '',
                    country: ''
                  }
                })
              }
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
          disabled={user?.onlyOnline}
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
          disabled={user?.onlyOnline}
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
          disabled={user?.onlyOnline}
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
          type="text"
          name="country"
          id="country"
          disabled={user?.onlyOnline}
          value={user?.address?.country || ''}
          onChange={handleAddressChange}
          placeholder="Unesite državu"
        />
        <small className={clsx('text-gray40', 'italic', '-mt-2', 'mb-2')}>
          Za funkcionalnost 'Navigacija' potrebno je da se minimum popuni Država
          i Grad, kako bi funkcionalnost radila preciznije unesite i ulicu i
          broj vaše poslovnice.
          <br />
          Nakon unosa proverite ispravnost navigacije i po potrebi editujte
          adresu.
        </small>
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
          disabled={
            isLoadingUser || Object.values(errors).some((error) => !!error)
          }
        />
      </div>
    </form>
  );
};
