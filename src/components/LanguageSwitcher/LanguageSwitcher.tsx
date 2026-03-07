import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@green-world/i18n';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
  color?: string;
};

export const LanguageSwitcher = ({
  color = 'inherit'
}: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();

  const normalizedLanguage = i18n.language.toLowerCase().split('-')[0];

  const handleLanguageChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: SupportedLanguage | null
  ) => {
    if (!newLanguage || !SUPPORTED_LANGUAGES.includes(newLanguage)) return;
    i18n.changeLanguage(newLanguage);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.includes(
    normalizedLanguage as SupportedLanguage
  )
    ? (normalizedLanguage as SupportedLanguage)
    : 'sr';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        <ToggleButton
          value="sr"
          sx={{
            color,
            '&.Mui-selected': { color: 'primary.main' }
          }}
        >
          {t('language.sr')}
        </ToggleButton>
        <ToggleButton
          value="en"
          sx={{
            color,
            '&.Mui-selected': { color: 'primary.main' }
          }}
        >
          {t('language.en')}
        </ToggleButton>
        <ToggleButton
          value="ru"
          sx={{
            color,
            '&.Mui-selected': { color: 'primary.main' }
          }}
        >
          {t('language.ru')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
