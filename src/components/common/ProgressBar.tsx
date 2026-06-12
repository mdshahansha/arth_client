import React from 'react';
import Box from '@mui/material/Box';
import { spacing } from '../../theme/tokens';
import { useThemeColors } from '../../hooks/useThemeColors';

interface ProgressBarProps {
  value: number; /* 0–100 percentage */
  color?: string;
  trackColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  trackColor,
}) => {
  const themeColors = useThemeColors();
  const barColor = color ?? themeColors.tealGreen;
  const barTrack = trackColor ?? themeColors.progressTrack;

  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <Box
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        width: '100%',
        height: spacing.progressBarHeight,
        backgroundColor: barTrack,
        borderRadius: spacing.progressBarHeight / 2,
        overflow: 'hidden',
        mt: '6px',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: `${clampedValue}%`,
          height: '100%',
          backgroundColor: barColor,
          borderRadius: spacing.progressBarHeight / 2,
          transition: 'width 600ms ease-out, background-color 0.3s ease',
        }}
      />
    </Box>
  );
};
