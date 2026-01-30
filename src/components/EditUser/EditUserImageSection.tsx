import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import { useImage } from '@green-world/hooks/useImage';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Avatar, Box, Button, Stack } from '@mui/material';
import { Camera, ScanQrCode, Store } from 'lucide-react';
import { useContext } from 'react';
import { toast } from 'react-toastify';

import { CustomQRCode, ImageDropzone, SectionHeader } from './components';

export const EditUserImageSection = () => {
  const { user, isLoading } = useContext(UserContext);
  const { mutate, isPending: isLoadingUser } = useEditUser();
  const { mutate: imageMutate, isPending: isImageLoadingUser } = useImage(true);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
    toast.success('Uspešno ste dodali novu sliku.');
  };

  const handleSave = () => mutate(user);

  return (
    <Box>
      {/* PROFILE IMAGE CARD */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          py: 4,
          mb: 4,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <SectionHeader
          icon={Camera}
          title="Profilna fotografija"
          description="Fotografija koja se prikazuje kao Vaša profilna slika"
        />

        <Stack
          direction={{ xs: 'column', lgm: 'row' }}
          paddingX={4}
          spacing={4}
          alignItems="center"
        >
          {/* AVATAR */}
          <Box
            sx={{
              width: 150,
              height: 150,
              minWidth: 150,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              border: '4px solid #fff'
            }}
          >
            <Avatar
              src={formatImageUrl(user?.profileImage, 55)}
              alt={user?.name}
              sx={{ width: '100%', height: '100%' }}
            />
          </Box>

          {/* UPLOAD */}
          <Stack spacing={2} sx={{ width: '100%' }}>
            <ImageDropzone
              onChange={handleImage}
              disabled={isLoading || isImageLoadingUser || isLoadingUser}
            />

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading || isImageLoadingUser || isLoadingUser}
            >
              Sačuvaj novu profilnu sliku
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* QR CODES */}
      <Stack
        direction={{ xs: 'column', lgm: 'row' }}
        spacing={4}
        justifyContent="space-between"
      >
        {/* WEBSITE QR */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', lgm: '1 1 50%' },
            backgroundColor: 'background.paper',
            borderRadius: 2,
            py: 3,
            textAlign: 'center',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <SectionHeader
            icon={ScanQrCode}
            title="Link ka vašem website-u"
            description="QR kod Vašeg website-a koji ste ostavili u opisu prodavnice"
            bgColor="rgba(255, 153, 51, 0.08)"
            iconColor="warning.main"
          />
          <Box sx={{ width: '100%', px: 4 }}>
            <CustomQRCode link={user?.website} />
          </Box>
        </Box>

        {/* SHOP QR */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', lgm: '1 1 50%' },
            backgroundColor: 'rgba(255, 153, 51, 0.08)',
            borderRadius: 2,
            py: 3,
            textAlign: 'center'
          }}
        >
          <SectionHeader
            icon={Store}
            title="Zeleni Svet prodavnica"
            description="QR kod sa linkom do Vaše prodavnice na Zelenom Svetu"
            iconColor="success.main"
          />

          <Box sx={{ width: '100%', px: 4 }}>
            <CustomQRCode link={`https://zelenisvet.rs/shop/${user?._id}`} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
