import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TransactionRow } from './TransactionRow';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { Transaction } from '../../types';

interface TransactionGroupProps {
  label: string;
  transactions: Transaction[];
}

export const TransactionGroup: React.FC<TransactionGroupProps> = ({ label, transactions }) => {
  const colors = useThemeColors();
  return (
  <Box sx={{ mb: '8px' }}>
    {/* Group header */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: '12px',
        borderBottom: `1px solid ${colors.divider}`,
        mb: '4px',
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>
        {label}
      </Typography>
      <IconButton size="small" sx={{ color: colors.textSecondary }}>
        <MoreHorizIcon />
      </IconButton>
    </Box>

    {/* Rows */}
    {transactions.map((txn) => (
      <TransactionRow key={txn.id} transaction={txn} />
    ))}
  </Box>
  );
};
