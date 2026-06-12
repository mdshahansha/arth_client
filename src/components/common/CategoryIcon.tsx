import React from 'react';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FlightIcon from '@mui/icons-material/Flight';
import { accents, spacing } from '../../theme/tokens';
import type { TransactionCategory } from '../../types';

const categoryConfig: Record<TransactionCategory, { color: string; icon: React.ReactElement }> = {
  food: { color: accents.categoryFood, icon: <RestaurantIcon sx={{ fontSize: 22, color: '#fff' }} /> },
  shopping: { color: accents.categoryShopping, icon: <ShoppingCartIcon sx={{ fontSize: 22, color: '#fff' }} /> },
  bills: { color: accents.categoryBills, icon: <ReceiptLongIcon sx={{ fontSize: 22, color: '#fff' }} /> },
  entertainment: { color: accents.categoryEntertainment, icon: <SportsEsportsIcon sx={{ fontSize: 22, color: '#fff' }} /> },
  travel: { color: accents.categoryTravel, icon: <FlightIcon sx={{ fontSize: 22, color: '#fff' }} /> },
};

interface CategoryIconProps {
  category: TransactionCategory;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = spacing.iconCircleSize }) => {
  const config = categoryConfig[category] || { color: '#9A9CA5', icon: <ReceiptLongIcon sx={{ fontSize: 22, color: '#fff' }} /> };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {config.icon}
    </Box>
  );
};
