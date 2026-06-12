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

const PlaceholderPage = lazy(() =>
  import('../../pages/PlaceholderPage').then((m) => ({ default: m.PlaceholderPage }))
);

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

  const renderMainContent = () => {
    switch (activeNav) {
      case 'Dashboard':
      case 'Expenses':
        return <DashboardPage />;
      default:
        return (
          <Suspense fallback={<Skeleton variant="rounded" width="100%" height="100vh" />}>
            <PlaceholderPage title={activeNav} />
          </Suspense>
        );
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
        <RightPanel
          categories={categories}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};
