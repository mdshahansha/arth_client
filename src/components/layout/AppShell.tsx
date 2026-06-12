import React, { lazy, Suspense, useCallback } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { DashboardPage } from '../../pages/DashboardPage';
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

  const handleNavChange = useCallback(
    (item: string) => dispatch(setActiveNav(item)),
    [dispatch],
  );

  const showRightPanel = activeNav === 'Dashboard';

  const renderMainContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Expenses':
        return <Suspense fallback={<PageFallback />}><ExpensesPage /></Suspense>;
      case 'Wallets':
        return <Suspense fallback={<PageFallback />}><WalletsPage /></Suspense>;
      case 'Summary':
        return <Suspense fallback={<PageFallback />}><SummaryPage /></Suspense>;
      case 'Accounts':
        return <Suspense fallback={<PageFallback />}><AccountsPage /></Suspense>;
      case 'Settings':
        return <Suspense fallback={<PageFallback />}><SettingsPage /></Suspense>;
      case 'View Tips':
        return <Suspense fallback={<PageFallback />}><ViewTipsPage /></Suspense>;
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
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
