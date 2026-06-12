import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { lightColors, darkColors, accents, typography, spacing } from './tokens';

/* ─── Shared base config ─── */
const baseTheme: ThemeOptions = {
  breakpoints: {
    values: { xs: 0, sm: 768, md: 1280, lg: 1440, xl: 1920 },
  },
  typography: {
    fontFamily: typography.fontFamily,
    button: {
      fontSize: typography.buttonText.fontSize,
      fontWeight: typography.buttonText.fontWeight,
      letterSpacing: typography.buttonText.letterSpacing,
      textTransform: typography.buttonText.textTransform,
    },
  },
  shape: { borderRadius: spacing.buttonBorderRadius },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { margin: 0, padding: 0, fontFamily: typography.fontFamily },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: spacing.buttonBorderRadius,
          textTransform: 'uppercase' as const,
          fontWeight: 600,
          letterSpacing: '1px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
      defaultProps: { disableElevation: true },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: '8px' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'standard' as const },
    },
  },
};

/* ─── Light Theme ─── */
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: accents.chartBarActive },
    secondary: { main: accents.tealGreen },
    error: { main: accents.errorRed },
    background: {
      default: lightColors.pageBg,
      paper: lightColors.cardBg,
    },
    text: {
      primary: lightColors.textPrimary,
      secondary: lightColors.textSecondary,
    },
    divider: lightColors.divider,
  },
  components: {
    ...baseTheme.components,
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: lightColors.textPrimary,
          color: '#FFFFFF',
          fontSize: '12px',
          borderRadius: '6px',
          padding: '8px 12px',
          fontFamily: typography.fontFamily,
        },
        arrow: { color: lightColors.textPrimary },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
          fontSize: '15px',
          '&:before': { borderBottomColor: lightColors.inputUnderline },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: lightColors.textSecondary },
          '&:after': { borderBottomColor: lightColors.textPrimary },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
          fontSize: '14px',
          color: lightColors.textSecondary,
          '&.Mui-focused': { color: lightColors.textPrimary },
        },
      },
    },
  },
});

/* ─── Dark Theme ─── */
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: accents.chartBarActive },
    secondary: { main: accents.tealGreen },
    error: { main: accents.errorRed },
    background: {
      default: darkColors.pageBg,
      paper: darkColors.cardBg,
    },
    text: {
      primary: darkColors.textPrimary,
      secondary: darkColors.textSecondary,
    },
    divider: darkColors.divider,
  },
  components: {
    ...baseTheme.components,
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2B2B40',
          color: '#E4E6EF',
          fontSize: '12px',
          borderRadius: '6px',
          padding: '8px 12px',
          fontFamily: typography.fontFamily,
        },
        arrow: { color: '#2B2B40' },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
          fontSize: '15px',
          color: darkColors.textPrimary,
          '&:before': { borderBottomColor: darkColors.inputUnderline },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: darkColors.textSecondary },
          '&:after': { borderBottomColor: accents.chartBarActive },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
          fontSize: '14px',
          color: darkColors.textSecondary,
          '&.Mui-focused': { color: darkColors.textPrimary },
        },
      },
    },
  },
});
