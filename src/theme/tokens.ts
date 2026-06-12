/* ─── Design Tokens ───
   Extracted from the Figma screens. Every color, size, and spacing value
   used in the app must reference these tokens — no magic numbers elsewhere. */

/* ─── Light Mode Colors ─── */
export const lightColors = {
  pageBg: '#000000',
  appBg: '#171717',
  cardBg: '#FFFFFF',
  rightPanelBg: '#F7F8FA',
  promoBg: '#EEF3FE',
  textPrimary: '#1F2233',
  textSecondary: '#9A9CA5',
  textMuted: '#B5B5C3',
  sidebarInactive: '#5B5D63',
  sidebarActive: '#FFFFFF',
  divider: '#EBEDF3',
  inputUnderline: '#E0E0E0',
  progressTrack: '#E4E6EF',
  chartBarInactive: '#DBE4F8',
  loginButton: '#3F4254',
  ctaButton: '#171717',
  errorBg: '#FFF3F3',
  successBg: '#F0FFF4',
  errorCardBg: '#FFF5F5',
  modalBg: '#FFFFFF',
} as const;

/* ─── Dark Mode Colors ─── */
export const darkColors = {
  pageBg: '#000000',
  appBg: '#0D0D12',
  cardBg: '#1E1E2D',
  rightPanelBg: '#16162A',
  promoBg: '#1A1A3E',
  textPrimary: '#E4E6EF',
  textSecondary: '#7E8299',
  textMuted: '#565674',
  sidebarInactive: '#7E8299',
  sidebarActive: '#FFFFFF',
  divider: '#2B2B40',
  inputUnderline: '#3F3F5A',
  progressTrack: '#2B2B40',
  chartBarInactive: '#2B2B48',
  loginButton: '#5A5CC6',
  ctaButton: '#5A5CC6',
  errorBg: '#2D1A1A',
  successBg: '#1A2D1A',
  errorCardBg: '#2D1A1A',
  modalBg: '#1E1E2D',
} as const;

/* ─── Shared accent colors (same in both themes) ─── */
export const accents = {
  tealGreen: '#1BC5BD',
  chartBarActive: '#2F6BFF',
  notificationBadge: '#F64E60',
  errorRed: '#F64E60',
  categoryGrocery: '#22A7F0',
  categoryTransportation: '#A55EEA',
  categoryHousing: '#F7941D',
  categoryFood: '#EE4E4E',
  categoryEntertainment: '#2ECC71',
  categoryBills: '#F7941D',
  categoryTravel: '#A55EEA',
  categoryShopping: '#22A7F0',
} as const;

/* ─── Backward-compatible `colors` export (light defaults) ─── */
export const colors = {
  ...lightColors,
  ...accents,
} as const;

export const typography = {
  fontFamily: "'Poppins', 'Helvetica', 'Arial', sans-serif",

  pageTitle: { fontSize: '34px', fontWeight: 600 },
  sectionHeader: { fontSize: '16px', fontWeight: 600 },
  transactionTitle: { fontSize: '15px', fontWeight: 600 },
  timestamp: { fontSize: '13px', fontWeight: 400 },
  sidebarNav: { fontSize: '17px', fontWeight: 500 },
  sidebarNavActive: { fontSize: '17px', fontWeight: 600 },
  rightPanelHeader: { fontSize: '17px', fontWeight: 600 },
  rightPanelAmount: { fontSize: '14px', fontWeight: 500 },
  buttonText: { fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' as const },
  userName: { fontSize: '24px', fontWeight: 600 },
  userEmail: { fontSize: '14px', fontWeight: 400 },
} as const;

export const spacing = {
  sidebarWidth: 280,
  rightPanelWidth: 310,
  cardBorderRadius: 24,
  cardPadding: 40,
  modalBorderRadius: 16,
  buttonBorderRadius: 8,
  iconCircleSize: 44,
  progressBarHeight: 4,
  transactionRowGap: 28,
} as const;

export const breakpoints = {
  desktop: 1280,
  tablet: 768,
} as const;
