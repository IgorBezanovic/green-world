import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

const doDownload = (url: string, fileName: string) => {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const downloadCanvasQRCode = () => {
  const canvas = document
    .getElementById('myqrcode')
    ?.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, 'QRCode.png');
  }
};

const downloadSvgQRCode = (svgRef: React.RefObject<SVGSVGElement | null>) => {
  const svgElement = svgRef.current;
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  doDownload(url, 'QRCode.svg');
};

export const CustomQRCode = ({
  link = 'https://zeleni-svet.com'
}: {
  link: string;
}) => {
  const [renderType, setRenderType] = useState<'canvas' | 'svg'>('canvas');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isValidURL = (url: string): boolean => {
    const regex =
      /((https:\/\/|ftp:\/\/|www\.)\S+\.[^()\n ]+((?:\([^)]*\))|[^.,;:?!"'\n)\]<* ])+)/;
    return regex.test(url);
  };

  useEffect(() => {
    if (!isValidURL(link)) console.warn('Invalid URL for QR code');
  }, [link]);

  return (
    <Box
      id="myqrcode"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'flex-start'
      }}
    >
      <Typography variant="body1">{link}</Typography>

      <ToggleButtonGroup
        value={renderType}
        exclusive
        onChange={(_, val) => val && setRenderType(val)}
        sx={{ mb: 2, mx: 'auto', mt: 4 }}
      >
        <ToggleButton value="canvas">Canvas</ToggleButton>
        <ToggleButton value="svg">SVG</ToggleButton>
      </ToggleButtonGroup>

      {isValidURL(link) && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            mx: 'auto',
            gap: 2,
            alignItems: 'flex-start'
          }}
        >
          {renderType === 'canvas' ? (
            <QRCodeCanvas value={link} bgColor="#fff" size={180} />
          ) : (
            <QRCodeSVG ref={svgRef} value={link} bgColor="#fff" size={180} />
          )}

          <Button
            variant="contained"
            onClick={() =>
              renderType === 'canvas'
                ? downloadCanvasQRCode()
                : downloadSvgQRCode(svgRef)
            }
            sx={{ width: '100%', mt: 2 }}
          >
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
};
