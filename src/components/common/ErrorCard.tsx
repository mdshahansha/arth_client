import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useThemeColors } from '../../hooks/useThemeColors';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message, onRetry }) => {
  const colors = useThemeColors();
  return (
    <Box
      role="alert"
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: colors.errorCardBg,
        border: `1px solid ${colors.errorRed}20`,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: colors.errorRed, fontSize: '14px', fontWeight: 500, mb: onRetry ? 2 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button
          onClick={onRetry}
          sx={{
            backgroundColor: colors.errorRed,
            color: '#fff',
            fontSize: '12px',
            px: 3,
            '&:hover': { backgroundColor: '#d43b4d' },
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};
