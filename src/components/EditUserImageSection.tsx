import { useEditUser } from '@green-world/hooks/useEditUser';
import { useImage } from '@green-world/hooks/useImage';
import { useUser } from '@green-world/hooks/useUser';
import { getItem } from '@green-world/utils/cookie';
import { User } from '@green-world/utils/types';
import { Divider } from 'antd';
import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { CustomButton, CustomQRCode } from '.';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const EditUserImageSection = () => {
  const decodedToken: any = jwtDecode(getItem('token')!);
  const { data, isLoading } = useUser(decodedToken._id);
  const { mutate, isLoading: isLoadingUser } = useEditUser();
  const {
    mutate: imageMutate,
    isLoading: isImageLoadingUser,
    data: profileImage
  } = useImage();

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
    if (data && !isLoading) {
      setUser({
        ...data,
        profileImage: profileImage || data?.profileImage
      });
    }
  }, [data, isLoading, profileImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files!)[0];

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
  };

  const handleSave = () => {
    mutate(user);
  };

  return (
    <section className={clsx('flex', 'w-full', 'flex-col')}>
      <section
        className={clsx(
          'flex',
          'flex-col',
          'justify-between',
          'items-center',
          'h-full',
          'gap-4'
        )}
      >
        <Helmet>
          <title>Zeleni svet | Podešavanje profilne slike | QR kod</title>
          <link
            rel="canonical"
            href="https://www.zeleni-svet.com/profile-settings/change-image"
          />
        </Helmet>
        <p className={clsx('text-gray40', 'italic', 'mb-4')}>
          Fotografija koju prikazujemo kao Vašu profilnu sliku.
        </p>
        <div
          className={clsx(
            'w-[150px]',
            'h-[150px]',
            'overflow-hidden',
            'rounded-full',
            'shadow-md',
            'relative',
            'mx-auto',
            'md:mx-0'
          )}
        >
          <img src={user?.profileImage || ZSLogo} height="100%" width="100%" />
        </div>
        <label
          htmlFor="profileImage"
          className={clsx(
            'flex-1',
            'flex-grow-0',
            'uppercase',
            'border',
            'border-forestGreen',
            'text-forestGreen',
            'rounded',
            'py-2',
            'px-4',
            'shadow-md',
            'bg-whiteLinen',
            'text-center',
            'cursor-pointer'
          )}
        >
          Odaberi sliku
        </label>
        <input
          type="file"
          name="profileImage"
          id="profileImage"
          accept="image/*"
          onChange={handleImage}
          className={clsx('hidden')}
          disabled={isLoading || isImageLoadingUser || isLoadingUser}
        ></input>
        <CustomButton
          type="text"
          onClick={handleSave}
          disabled={isLoading || isImageLoadingUser || isLoadingUser}
        >
          Sačuvaj novi profilnu sliku
        </CustomButton>
      </section>
      <Divider />
      <section className={clsx('flex', 'w-full', 'justify-evenly')}>
        <div className={clsx('flex', 'flex-col', 'items-center', 'w-1/2')}>
          <p className={clsx('text-gray40', 'italic', 'mb-4', 'text-center')}>
            Generisani QR kod vašeg website.
          </p>
          <CustomQRCode link={user?.website} icon={user?.profileImage || ''} />
        </div>
        <div className={clsx('flex', 'flex-col', 'items-center', 'w-1/2')}>
          <p className={clsx('text-gray40', 'italic', 'mb-4', 'text-center')}>
            Generisani QR kod vašeg prodavnice na našem sajtu Zeleni svet.
          </p>
          <CustomQRCode link={user?.website} icon={ZSLogo} />
        </div>
      </section>
    </section>
  );
};
