import { Chip, Box } from '@mui/material';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const BookmarkButton = ({ label = 'Bookmark' }: { label?: string }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    const url = window.location.href;
    const title = document.title || label;

    try {
      const win = window as any;
      if (win.sidebar && typeof win.sidebar.addPanel === 'function') {
        win.sidebar.addPanel(title, url, '');
        return;
      }
      if (win.external && typeof win.external.AddFavorite === 'function') {
        win.external.AddFavorite(url, title);
        return;
      }
    } catch (e) {
      // fallthrough to generic fallback
    }

    // Generic fallback: copy the URL and instruct the user to press the browser shortcut
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.info(t('bookmarkButton.linkCopiedInfo'));
        })
        .catch(() => {
          alert(t('bookmarkButton.bookmarkShortcutAlert', { url }));
        });
    } else {
      alert(t('bookmarkButton.bookmarkShortcutAlert', { url }));
    }
  };

  return (
    <Chip
      aria-label="bookmark-browser"
      variant="outlined"
      color="secondary"
      onClick={handleClick}
      label={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <BookmarkIcon /> {t('bookmarkButton.label')}
        </Box>
      }
    />
  );
};
