import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const colors = useThemeColors();
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: colors.cardBg,
        borderRadius: `${spacing.cardBorderRadius}px 0 0 ${spacing.cardBorderRadius}px`,
        p: `${spacing.cardPadding}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '34px', fontWeight: 600, color: colors.textPrimary, mb: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '16px', color: colors.textSecondary }}>
          Coming soon
        </Typography>
      </Box>
    </Box>
  );
};
