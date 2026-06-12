import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { lightColors, darkColors, accents } from '../theme/tokens';

export type ThemeColors = typeof lightColors & typeof accents;

/**
 * Returns the full color palette for the current theme mode.
 * Use this instead of importing `colors` directly from tokens.
 */
export function useThemeColors(): ThemeColors {
  const theme = useTheme();
  return useMemo(() => {
    const modeColors = theme.palette.mode === 'dark' ? darkColors : lightColors;
    return { ...modeColors, ...accents } as ThemeColors;
  }, [theme.palette.mode]);
}
