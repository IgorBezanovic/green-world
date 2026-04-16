import { WorkingTime } from '@green-world/utils/types';
import { Box, Card, IconButton, Typography } from '@mui/material';
import { Edit2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WorkingHoursCardProps {
  workingTime: WorkingTime;
  onEdit?: () => void;
}

export const WorkingHoursCard = ({
  workingTime,
  onEdit
}: WorkingHoursCardProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 2 }}>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1" mb={2}>
            {t('shopPage.workingHours')}
          </Typography>
          {onEdit && (
            <IconButton onClick={onEdit} sx={{ mb: 2 }}>
              <Edit2Icon />
            </IconButton>
          )}
        </Box>

        {Object.entries(workingTime).map(([day, value]) => (
          <Box
            key={day}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 0.6
            }}
          >
            <Typography sx={{ textTransform: 'capitalize' }}>
              {t(`editUserData.days.${day}`, { defaultValue: day })}
            </Typography>

            <Typography color="text.secondary">
              {value.isClosed
                ? t('shopPage.closed')
                : value.open && value.close
                  ? `${value.open} - ${value.close}`
                  : '-'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
