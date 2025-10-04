import { TikTokIcon } from '@green-world/components';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

interface SocialMediaProps {
  socialMediaLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
  };
  color: string;
}

export const SocialMedia = (props: SocialMediaProps) => {
  const [linksToRender, setLinksToRender] = useState<
    SocialMediaProps['socialMediaLinks']
  >({});

  useEffect(() => {
    const defaultLinks = {
      instagram: 'https://www.instagram.com/zeleni_svet_rs/',
      facebook: 'https://www.facebook.com/profile.php?id=61577326298021',
      tiktok: 'https://www.tiktok.com/@zelenisvetinfo',
      linkedin: 'https://www.linkedin.com/company/zeleni-svet/'
    };

    if (props?.socialMediaLinks) {
      setLinksToRender(props?.socialMediaLinks);
    } else {
      setLinksToRender(defaultLinks);
    }
  }, [props]);

  return (
    <Box sx={{ display: 'flex' }}>
      {linksToRender?.instagram && (
        <IconButton
          component="a"
          href={linksToRender.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon sx={{ color: props?.color, fontSize: 32 }} />
        </IconButton>
      )}
      {linksToRender?.linkedin && (
        <IconButton
          component="a"
          href={linksToRender.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon sx={{ color: props?.color, fontSize: 32 }} />
        </IconButton>
      )}
      {linksToRender?.facebook && (
        <IconButton
          component="a"
          href={linksToRender.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FacebookIcon sx={{ color: props?.color, fontSize: 32 }} />
        </IconButton>
      )}
      {linksToRender?.linkedin && (
        <IconButton
          component="a"
          href={linksToRender.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          <TikTokIcon />
        </IconButton>
      )}
    </Box>
  );
};
