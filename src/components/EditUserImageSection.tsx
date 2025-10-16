import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import { useImage } from '@green-world/hooks/useImage';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Avatar } from '@mui/material';
import { Divider } from 'antd';
import clsx from 'clsx';
import { useContext } from 'react';
import { toast } from 'react-toastify';

import { CustomButton, CustomQRCode } from '.';

import ZSLogo from '/zeleni-svet-yellow-transparent.png';

export const EditUserImageSection = () => {
  const { user, isLoading } = useContext(UserContext);
  const { mutate, isPending: isLoadingUser } = useEditUser();
  const { mutate: imageMutate, isPending: isImageLoadingUser } = useImage(true);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files!)[0];

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
    toast.success('Uspešno ste dodali novu sliku.');
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
        <title>Zeleni svet | Podešavanje profilne slike | QR kod</title>
        <link
          rel="canonical"
          href="https://www.zelenisvet.rs/profile-settings/change-image"
        />

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
          <Avatar
            src={formatImageUrl(user?.profileImage, 55)}
            alt={user?.name}
            sx={{
              width: '100%',
              height: '100%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          />
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
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleImage}
          className={clsx('hidden')}
          disabled={isLoading || isImageLoadingUser || isLoadingUser}
        ></input>
        <CustomButton
          type="text"
          onClick={handleSave}
          disabled={isLoading || isImageLoadingUser || isLoadingUser}
        >
          Sačuvaj novu profilnu sliku
        </CustomButton>
      </section>
      <Divider />
      <section className={clsx('flex', 'w-full', 'justify-evenly')}>
        <div className={clsx('flex', 'flex-col', 'items-center', 'w-1/2')}>
          <p className={clsx('text-gray40', 'italic', 'mb-4', 'text-center')}>
            Generisani QR kod vašeg website.
          </p>
          <CustomQRCode
            link={user?.website}
            icon={formatImageUrl(user?.profileImage || '', 55)}
          />
        </div>
        <div className={clsx('flex', 'flex-col', 'items-center', 'w-1/2')}>
          <p className={clsx('text-gray40', 'italic', 'mb-4', 'text-center')}>
            Generisani QR kod vašeg prodavnice na našem sajtu Zeleni svet.
          </p>
          <CustomQRCode link={'https://zelenisvet.rs'} icon={ZSLogo} />
        </div>
      </section>
    </section>
  );
};
