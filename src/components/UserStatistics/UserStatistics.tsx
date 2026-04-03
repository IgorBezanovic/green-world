import UserContext from '@green-world/context/UserContext';
import { Box, Stack } from '@mui/material';
import {
  Activity,
  BriefcaseBusiness,
  Eye,
  Mail,
  Notebook,
  Package,
  Sparkles
} from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { PromotionCard } from '../PromotionCard';
import { StatCard } from '../StatCard';
import {
  ContentDistribution,
  StatsBarChart,
  TopContent,
  UserRecommendation
} from './components';

export const UserStatistics = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const totalViewsByType = user.statistics?.totalViews;
  const productsViews = Number(totalViewsByType?.products ?? 0);
  const actionsViews = Number(totalViewsByType?.actions ?? 0);
  const blogsViews = Number(totalViewsByType?.blogs ?? 0);
  const servicesViews = Number(totalViewsByType?.services ?? 0);
  const engagementScore = Number(user.statistics?.engagementScore ?? 0);

  const totalViews = productsViews + actionsViews + blogsViews + servicesViews;

  return (
    <Stack spacing={2}>
      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: 3,
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          gridTemplateColumns: 'repeat(1, 1fr)',
          '@media (min-width: 600px)': {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          '@media (min-width: 900px)': {
            gridTemplateColumns: 'repeat(4, 1fr)'
          }
        }}
      >
        <StatCard
          icon={Eye}
          value={totalViews}
          title={t('userStatistics.totalViewsTitle')}
          subtitle={t('userStatistics.totalViewsSubtitle')}
        />
        <StatCard
          icon={Package}
          value={user.numberOfProducts}
          title={t('userStatistics.addedProductsTitle')}
          subtitle={t('userStatistics.viewsCount', {
            count: productsViews
          })}
        />
        <StatCard
          icon={Activity}
          value={user.numberOfActions}
          title={t('userStatistics.createdActivitiesTitle')}
          subtitle={t('userStatistics.viewsCount', {
            count: actionsViews
          })}
        />
        <StatCard
          icon={Notebook}
          value={user.numberOfBlogs}
          title={t('userStatistics.publishedBlogsTitle')}
          subtitle={t('userStatistics.viewsCount', {
            count: blogsViews
          })}
        />
        <StatCard
          icon={BriefcaseBusiness}
          value={user.numberOfServiceListings || 0}
          title={t('userStatistics.addedServicesTitle')}
          subtitle={t('userStatistics.viewsCount', {
            count: servicesViews
          })}
        />
      </Box>
      {/* VIEWS PER ITEM*/}
      <StatsBarChart user={user} />
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.up('md')]: {
            flexDirection: 'row'
          },
          gap: 2
        })}
      >
        {/* CONTENT DISTRIBUTION */}
        <ContentDistribution user={user} />
        {/* ENGAGEMENT SCORE */}
        <Box sx={{ flexGrow: 1 }}>
          <PromotionCard
            icon={Sparkles}
            title={t('userStatistics.engagementTitle')}
            description={t('userStatistics.engagementDescription', {
              score: engagementScore
            })}
            badgeLabel={`${engagementScore}`}
            variant="success"
          />
        </Box>
      </Box>
      {/* ORDERS BY EMAIL */}
      <PromotionCard
        icon={Mail}
        title={t('userStatistics.ordersByEmailTitle')}
        description={t('userStatistics.ordersByEmailDescription', {
          count: user.statistics.numberOfOrdersByEmail
        })}
        badgeLabel={`${user.statistics.numberOfOrdersByEmail}`}
        variant="success"
      />
      {/* TOP CONTENT */}
      <TopContent user={user} />
      {/* USER RECOMMENDATION */}
      <UserRecommendation />
    </Stack>
  );
};
