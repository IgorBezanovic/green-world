import UserContext from '@green-world/context/UserContext';
import { Box, Stack } from '@mui/material';
import { Activity, Eye, Mail, Notebook, Package, Sparkles } from 'lucide-react';
import { useContext } from 'react';

import { PromotionCard } from '../PromotionCard';
import { StatCard } from '../StatCard';
import {
  ContentDistribution,
  StatsBarChart,
  TopContent,
  UserRecommendation
} from './components';

export const UserStatistics = () => {
  const { user } = useContext(UserContext);
  const { engagementScore } = user.statistics;

  const totalViews =
    user.statistics.totalViews.products +
    user.statistics.totalViews.actions +
    user.statistics.totalViews.blogs;

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
          title="Ukupno pregleda"
          subtitle="Svi pregledi sadržaja"
        />
        <StatCard
          icon={Package}
          value={user.numberOfProducts}
          title="Dodati proizvodi"
          subtitle={`${user.statistics.totalViews.products} pregleda`}
        />
        <StatCard
          icon={Activity}
          value={user.numberOfActions}
          title="Kreirane aktivnosti"
          subtitle={`${user.statistics.totalViews.actions} pregleda`}
        />
        <StatCard
          icon={Notebook}
          value={user.numberOfBlogs}
          title="Objavljeni blogovi"
          subtitle={`${user.statistics.totalViews.blogs} pregleda`}
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
            title="Engagement score"
            description={`Vaš trenutni engagement score je ${engagementScore}. Ovaj skor odražava koliko su vaši proizvodi, aktivnosti i blogovi angažovani od strane korisnika. Viši skor ukazuje na bolju vidljivost i interakciju sa vašim sadržajem.`}
            badgeLabel={`${engagementScore}`}
            variant="success"
          />
        </Box>
      </Box>
      {/* ORDERS BY EMAIL */}
      <PromotionCard
        icon={Mail}
        title="Porudžbine putem e-maila"
        description={`Broj porudžbina koje ste primili putem e-maila iznosi ${user.statistics.numberOfOrdersByEmail}.`}
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
