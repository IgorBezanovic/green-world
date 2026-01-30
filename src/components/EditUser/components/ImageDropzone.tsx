import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

type ImageDropzoneProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export const ImageDropzone = ({ onChange, disabled }: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const fakeEvent = {
      target: { files: [file] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <Box
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        width: '100%',
        height: 180,
        borderRadius: 2,
        border: '2px dashed',
        borderColor: 'success.light',
        backgroundColor: 'rgba(46, 125, 50, 0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(46, 125, 50, 0.08)'
        }
      }}
    >
      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={onChange}
        disabled={disabled}
      />

      <Stack spacing={1} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'success.light',
            color: 'success.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CloudUploadOutlinedIcon />
        </Box>

        <Typography fontWeight={600}>Prevucite sliku ovde</Typography>

        <Typography variant="body2" color="text.secondary">
          ili kliknite da izaberete fajl
        </Typography>

        <Typography variant="caption" color="text.secondary">
          PNG, JPG do 5MB
        </Typography>
      </Stack>
    </Box>
  );
};
