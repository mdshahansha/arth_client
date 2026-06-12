import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatTransactionAmount, formatTime } from '../../utils/formatters';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { Transaction } from '../../types';

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const colors = useThemeColors();
  const { title, category, amount, type, transaction_date } = transaction;

  return (
    <Box
      className="slide-up"
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: '14px',
        gap: '16px',
      }}
    >
      <Tooltip title={category} arrow>
        <span>
          <CategoryIcon category={category} />
        </span>
      </Tooltip>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 600,
            color: colors.textPrimary,
            lineHeight: 1.4,
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 400,
            color: colors.textSecondary,
            mt: '2px',
          }}
        >
          {formatTime(transaction_date)} &bull; {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '15px',
          fontWeight: 600,
          color: colors.textPrimary,
          whiteSpace: 'nowrap',
        }}
      >
        {formatTransactionAmount(amount, type)}
      </Typography>
    </Box>
  );
};
