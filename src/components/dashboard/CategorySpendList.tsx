import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ProgressBar } from '../common/ProgressBar';
import { formatAmount } from '../../utils/formatters';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { CategoryBreakdown } from '../../types';

const categoryLabels: Record<string, string> = {
  food: 'Food and Drinks',
  shopping: 'Shopping',
  bills: 'Housing',
  travel: 'Transportation',
  entertainment: 'Vehicle',
};

interface CategorySpendListProps {
  categories: CategoryBreakdown[];
}

export const CategorySpendList: React.FC<CategorySpendListProps> = ({ categories }) => {
  const colors = useThemeColors();
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: '17px',
          fontWeight: 600,
          color: colors.textPrimary,
          mb: '24px',
          transition: 'color 0.3s ease',
        }}
      >
        Where your money go?
      </Typography>

      {categories.map((cat) => (
        <Tooltip key={cat.category} title={`${formatAmount(cat.amount)} total`} arrow>
          <Box sx={{ mb: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  transition: 'color 0.3s ease',
                }}
              >
                {categoryLabels[cat.category] || cat.category}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  transition: 'color 0.3s ease',
                }}
              >
                {formatAmount(cat.amount)}
              </Typography>
            </Box>
            <ProgressBar value={(cat.amount / maxAmount) * 100} />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};
