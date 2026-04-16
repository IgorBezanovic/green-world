import { HeroWatermark } from '@green-world/components/HeroWatermark';
import {
  Box,
  Divider,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { type LucideIcon, MapPin, Search } from 'lucide-react';

type ItemsHeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  subtitleMaxWidth?: number | string;
  /** Second search field — omit to render only one field */
  secondFieldPlaceholder?: string;
  secondFieldValue?: string;
  onSecondFieldChange?: (value: string) => void;
  /** Icon for the second field. Defaults to MapPin. */
  secondFieldIcon?: LucideIcon;
  /** @deprecated use secondFieldPlaceholder */
  locationPlaceholder?: string;
  /** @deprecated use secondFieldValue */
  locationValue?: string;
  /** @deprecated use onSecondFieldChange */
  onLocationChange?: (value: string) => void;
};

export const ItemsHero = ({
  kicker,
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  subtitleMaxWidth = 760,
  secondFieldPlaceholder,
  secondFieldValue,
  onSecondFieldChange,
  secondFieldIcon: SecondIcon = MapPin,
  // deprecated aliases — prefer secondField* props
  locationPlaceholder,
  locationValue,
  onLocationChange
}: ItemsHeroProps) => {
  const resolvedSecondPlaceholder =
    secondFieldPlaceholder ?? locationPlaceholder;
  const resolvedSecondValue = secondFieldValue ?? locationValue ?? '';
  const resolvedOnSecondChange = onSecondFieldChange ?? onLocationChange;
  const showSecondField = Boolean(
    resolvedSecondPlaceholder && resolvedOnSecondChange
  );
  return (
    <Box
      sx={(theme) => ({
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage:
          'linear-gradient(to right, rgba(22, 163, 74, 0.9), rgba(21, 128, 61, 0.9))',
        [theme.breakpoints.down('sm')]: { display: 'none' }
      })}
    >
      <HeroWatermark />

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          position: 'relative',
          zIndex: 1,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Divider sx={{ height: 1.5, width: 48, bgcolor: 'primary.light' }} />
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'primary.light',
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}
          >
            <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>
              {kicker}
            </Typography>
          </Box>
          <Divider sx={{ height: 1.5, width: 48, bgcolor: 'primary.light' }} />
        </Box>

        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            opacity: 0.9,
            mb: 4,
            maxWidth: subtitleMaxWidth,
            mx: 'auto',
            textAlign: 'center'
          }}
        >
          {subtitle}
        </Typography>

        <Box
          sx={(theme) => ({
            display: 'flex',
            gap: 2,
            bgcolor: 'white',
            p: 1,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 1024,
            width: '100%',
            mx: 'auto',
            mt: '24px',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: { flexDirection: 'row' }
          })}
        >
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="gray" size={20} />
                  </InputAdornment>
                ),
                disableUnderline: true
              }
            }}
            variant="standard"
            sx={{ px: 2, py: 1 }}
          />

          {showSecondField && (
            <TextField
              fullWidth
              placeholder={resolvedSecondPlaceholder}
              value={resolvedSecondValue}
              onChange={(e) => resolvedOnSecondChange!(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecondIcon color="gray" size={20} />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }
              }}
              variant="standard"
              sx={(theme) => ({
                px: 2,
                py: 1,
                borderLeft: 'none',
                [theme.breakpoints.up('md')]: {
                  borderLeft: '1px solid #e0e0e0'
                }
              })}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
