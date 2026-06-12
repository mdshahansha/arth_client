import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { CategorySpendList } from '../dashboard/CategorySpendList';
import { PromoCard } from '../dashboard/PromoCard';
import { spacing } from '../../theme/tokens';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { CategoryBreakdown } from '../../types';

interface RightPanelProps {
  categories?: CategoryBreakdown[];
  isLoading?: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({ categories, isLoading }) => {
  const colors = useThemeColors();
  return (
    <Box
      sx={{
        width: spacing.rightPanelWidth,
        minWidth: spacing.rightPanelWidth,
        backgroundColor: colors.rightPanelBg,
        borderRadius: `0 ${spacing.cardBorderRadius}px ${spacing.cardBorderRadius}px 0`,
        p: '40px 28px',
        display: { xs: 'none', md: 'block' },
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {isLoading ? (
        <>
          <Skeleton
            width={180}
            height={24}
            sx={{
              mb: 3,
              bgcolor: colors.divider,
              borderRadius: '6px',
            }}
          />
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Skeleton
                width="100%"
                height={16}
                sx={{ bgcolor: colors.divider, borderRadius: '4px' }}
              />
              <Skeleton
                width="60%"
                height={6}
                sx={{ mt: 1, bgcolor: colors.progressTrack, borderRadius: '3px' }}
              />
            </Box>
          ))}
        </>
      ) : categories && categories.length > 0 ? (
        <CategorySpendList categories={categories} />
      ) : (
        <CategorySpendList categories={[
          { category: 'food', amount: 0 },
          { category: 'shopping', amount: 0 },
          { category: 'bills', amount: 0 },
          { category: 'travel', amount: 0 },
          { category: 'entertainment', amount: 0 },
        ]} />
      )}
      <PromoCard />
    </Box>
  );
};
