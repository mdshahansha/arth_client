import React, { lazy, Suspense, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { DashboardPage } from '../../pages/DashboardPage';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveNav, setActiveNav } from '../../features/ui/uiSlice';
import { selectCategoryBreakdown, selectDashboardLoading } from '../../features/dashboard/dashboardSlice';
import { useThemeColors } from '../../hooks/useThemeColors';

const ExpensesPage = lazy(() =>
  import('../../pages/ExpensesPage').then((m) => ({ default: m.ExpensesPage }))
);
const WalletsPage = lazy(() =>
  import('../../pages/WalletsPage').then((m) => ({ default: m.WalletsPage }))
);
const SummaryPage = lazy(() =>
  import('../../pages/SummaryPage').then((m) => ({ default: m.SummaryPage }))
);
const AccountsPage = lazy(() =>
  import('../../pages/AccountsPage').then((m) => ({ default: m.AccountsPage }))
);
const SettingsPage = lazy(() =>
  import('../../pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const ViewTipsPage = lazy(() =>
  import('../../pages/ViewTipsPage').then((m) => ({ default: m.ViewTipsPage }))
);

const PageFallback = () => <Skeleton variant="rounded" width="100%" height="100vh" />;

export const AppShell: React.FC = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const activeNav = useAppSelector(selectActiveNav);
  const categories = useAppSelector(selectCategoryBreakdown);
  const isLoading = useAppSelector(selectDashboardLoading);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  const handleNavChange = useCallback(
    (item: string) => {
      dispatch(setActiveNav(item));
      setMobileOpen(false);
    },
    [dispatch],
  );

  const showRightPanel = activeNav === 'Dashboard' && !isTablet;

  const renderMainContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Expenses':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><ExpensesPage /></Suspense></ErrorBoundary>;
      case 'Wallets':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><WalletsPage /></Suspense></ErrorBoundary>;
      case 'Summary':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><SummaryPage /></Suspense></ErrorBoundary>;
      case 'Accounts':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><AccountsPage /></Suspense></ErrorBoundary>;
      case 'Settings':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><SettingsPage /></Suspense></ErrorBoundary>;
      case 'View Tips':
        return <ErrorBoundary><Suspense fallback={<PageFallback />}><ViewTipsPage /></Suspense></ErrorBoundary>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: colors.appBg,
        maxWidth: "100%",
        mx: 'auto',
        transition: 'background-color 0.3s ease',
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: colors.cardBg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': { backgroundColor: colors.cardBg },
          }}
        >
          <MenuIcon sx={{ color: colors.textPrimary }} />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              backgroundColor: colors.appBg,
              borderRight: 'none',
            },
          }}
        >
          <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        </Drawer>
      ) : (
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
      )}

      <Box component="main" id="main-content" role="main" aria-label="Main content" tabIndex={-1} sx={{ display: 'flex', flex: 1, overflow: 'hidden', outline: 'none' }}>
        {renderMainContent()}
        {showRightPanel && (
          <RightPanel
            categories={categories}
            isLoading={isLoading}
          />
        )}
      </Box>
    </Box>
  );
};
