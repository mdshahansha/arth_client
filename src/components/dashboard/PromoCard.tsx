import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useThemeColors } from '../../hooks/useThemeColors';

export const PromoCard: React.FC = () => {
  const colors = useThemeColors();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mt: '32px',
        p: '24px',
        borderRadius: '16px',
        backgroundColor: colors.promoBg,
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Simple illustration placeholder — drawers + plant */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect x="5" y="15" width="50" height="40" rx="4" fill="#F7941D" opacity="0.8" />
          <rect x="10" y="22" width="40" height="8" rx="2" fill="#FFB74D" />
          <rect x="10" y="34" width="40" height="8" rx="2" fill="#FFB74D" />
          <rect x="10" y="46" width="40" height="8" rx="2" fill="#FFB74D" />
          <circle cx="30" cy="26" r="2" fill="#fff" />
          <circle cx="30" cy="38" r="2" fill="#fff" />
          <circle cx="30" cy="50" r="2" fill="#fff" />
        </svg>
        <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
          <rect x="15" y="35" width="20" height="25" rx="3" fill="#A55EEA" opacity="0.6" />
          <ellipse cx="25" cy="30" rx="14" ry="12" fill="#2ECC71" opacity="0.8" />
          <ellipse cx="20" cy="25" rx="8" ry="10" fill="#27AE60" opacity="0.7" />
          <rect x="24" y="30" width="2" height="12" fill="#7E8299" />
        </svg>
      </Box>

      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          color: colors.textPrimary,
          mb: '8px',
          transition: 'color 0.3s ease',
        }}
      >
        Save more money
      </Typography>
      <Typography
        sx={{
          fontSize: '12px',
          color: colors.textSecondary,
          mb: '16px',
          lineHeight: 1.6,
          transition: 'color 0.3s ease',
        }}
      >
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.
      </Typography>
      <Button
        fullWidth
        sx={{
          backgroundColor: colors.ctaButton,
          color: '#fff',
          py: '10px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '1px',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: isDark ? '#4A4CB0' : '#2a2a2a',
          },
        }}
      >
        VIEW TIPS
      </Button>
    </Box>
  );
};
