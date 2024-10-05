import { QRCode, Segmented, Space } from 'antd';
import type { QRCodeProps } from 'antd';
import clsx from 'clsx';
import React, { useEffect } from 'react';

import { CustomButton } from './CustomButton';

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

const downloadSvgQRCode = () => {
  const svg = document
    .getElementById('myqrcode')
    ?.querySelector<SVGElement>('svg');
  const svgData = new XMLSerializer().serializeToString(svg!);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  doDownload(url, 'QRCode.svg');
};

export const CustomQRCode = ({
  link = 'https://zeleni-svet.com',
  icon
}: {
  link: string;
  icon: string;
}) => {
  const [renderType, setRenderType] =
    React.useState<QRCodeProps['type']>('canvas');

  useEffect(() => {
    if (link) return;
  }, [link, icon]);

  return (
    <Space id="myqrcode" direction="vertical" className={clsx('flex')}>
      <p>{link}</p>
      <Segmented
        options={['canvas', 'svg']}
        onChange={(val) => setRenderType(val as QRCodeProps['type'])}
      />
      <div>
        <QRCode
          type={renderType}
          value={link}
          bgColor="#fff"
          style={{ marginBottom: 16 }}
          icon={icon}
        />
        <CustomButton
          type="text"
          customStyle={'w-full'}
          onClick={
            renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode
          }
        >
          Download
        </CustomButton>
      </div>
    </Space>
  );
};
