import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { spacing, typography as typo } from '../../theme/tokens';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser, selectIsAuthenticated, openLoginModal, logoutThunk } from '../../features/auth/authSlice';
import { clearDashboard } from '../../features/dashboard/dashboardSlice';
import { clearTransactions } from '../../features/transactions/transactionsSlice';
import { useThemeMode } from '../../context/ThemeContext';

const navItems = ['Dashboard', 'Expenses', 'Wallets', 'Summary', 'Accounts', 'Settings', 'View Tips'];

interface SidebarProps {
  activeNav: string;
  onNavChange: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { mode, toggleTheme } = useThemeMode();

  const handleLogout = useCallback(async () => {
    await dispatch(logoutThunk());
    dispatch(clearDashboard());
    dispatch(clearTransactions());
  }, [dispatch]);

  const handleLoginClick = useCallback(() => {
    dispatch(openLoginModal());
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: spacing.sidebarWidth,
        minHeight: '100vh',
        backgroundColor: colors.appBg,
        display: 'flex',
        flexDirection: 'column',
        py: '40px',
        px: '36px',
        flexShrink: 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Profile */}
      <Box sx={{ mb: '48px' }}>
        <Badge
          badgeContent={isAuthenticated ? 4 : 0}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: colors.notificationBadge,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              top: 4,
              right: 4,
            },
          }}
        >
          <Avatar
            src={user?.profile_image_url || undefined}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid rgba(255,255,255,0.1)',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </Badge>
        <Typography
          sx={{
            color: colors.sidebarActive,
            fontSize: typo.userName.fontSize,
            fontWeight: typo.userName.fontWeight,
            mt: '16px',
            lineHeight: 1.3,
          }}
        >
          {isAuthenticated ? user?.name : 'Hi, User'}
        </Typography>
        <Typography
          sx={{
            color: colors.sidebarInactive,
            fontSize: typo.userEmail.fontSize,
            fontWeight: typo.userEmail.fontWeight,
            mt: '2px',
          }}
        >
          {isAuthenticated ? user?.email : 'user@gmail.com'}
        </Typography>
      </Box>

      {/* Navigation */}
      <Box component="nav" aria-label="Main navigation" sx={{ flex: 1 }}>
        <Box component="ul" role="list" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <Box
                component="li"
                key={item}
                role="listitem"
              >
                <Box
                  role="button"
                  tabIndex={0}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavChange(item)}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavChange(item); } }}
                  sx={{
                    py: '12px',
                    cursor: 'pointer',
                    fontSize: isActive ? typo.sidebarNavActive.fontSize : typo.sidebarNav.fontSize,
                    fontWeight: isActive ? typo.sidebarNavActive.fontWeight : typo.sidebarNav.fontWeight,
                    color: isActive ? colors.sidebarActive : colors.sidebarInactive,
                    transition: 'color 200ms, font-weight 200ms',
                    '&:hover': { color: colors.sidebarActive },
                    borderRadius: '8px',
                    px: '4px',
                  }}
                >
                  {item}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Bottom actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={toggleTheme} aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} sx={{ color: colors.sidebarInactive }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        <Box
          role="button"
          tabIndex={0}
          aria-label={isAuthenticated ? 'Logout from your account' : 'Login to your account'}
          onClick={isAuthenticated ? handleLogout : handleLoginClick}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (isAuthenticated ? handleLogout : handleLoginClick)(); } }}
          sx={{
            cursor: 'pointer',
            fontSize: typo.sidebarNav.fontSize,
            fontWeight: typo.sidebarNav.fontWeight,
            color: colors.sidebarInactive,
            '&:hover': { color: colors.sidebarActive },
            borderRadius: '8px',
            px: '4px',
          }}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </Box>
      </Box>
    </Box>
  );
};
