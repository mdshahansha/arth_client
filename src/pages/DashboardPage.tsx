import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import AddIcon from '@mui/icons-material/Add';
import { SpendChart } from '../components/dashboard/SpendChart';
import { TransactionGroup } from '../components/dashboard/TransactionGroup';
import { ErrorCard } from '../components/common/ErrorCard';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { getDateKey, getDateGroupLabel } from '../utils/formatters';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';
import type { Transaction } from '../types';

export const DashboardPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: dashboard, loading: dashLoading, error: dashError, refetch: refetchDash } = useDashboard();
  const {
    items: allTransactions,
    loading: txnLoading,
    error: txnError,
    hasNextPage,
    loadingMore: isFetchingNextPage,
    fetchNextPage,
    refetch: refetchTxn,
  } = useTransactions();

  /* Group transactions by date */
  const groupedTransactions = useMemo(() => {
    if (!allTransactions.length) return [];
    const groups = new Map<string, Transaction[]>();
    for (const txn of allTransactions) {
      const key = getDateKey(txn.transaction_date);
      const existing = groups.get(key) || [];
      existing.push(txn);
      groups.set(key, existing);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, txns]) => ({
        label: getDateGroupLabel(txns[0].transaction_date),
        transactions: txns,
      }));
  }, [allTransactions]);

  /* Chart data from monthly breakdown */
  const chartData = useMemo(() => {
    if (!dashboard?.monthlyBreakdown) return undefined;
    return dashboard.monthlyBreakdown.map((m, i) => ({
      day: i + 1,
      value: m.debit || 0,
      label: m.month,
    }));
  }, [dashboard]);

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: colors.cardBg,
        borderRadius: `${spacing.cardBorderRadius}px 0 0 ${spacing.cardBorderRadius}px`,
        p: `${spacing.cardPadding}px`,
        minHeight: '100vh',
        overflowY: 'auto',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '8px' }}>
        <Box>
          <Typography sx={{ fontSize: '34px', fontWeight: 600, color: colors.textPrimary }}>
            Expenses
          </Typography>
          <Typography sx={{ fontSize: '14px', color: colors.textSecondary, mt: '4px' }}>
            01 - 25 March, 2020
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '12px', border: '2px solid #fff' } }}>
            <Avatar sx={{ backgroundColor: '#F7941D' }}>A</Avatar>
            <Avatar sx={{ backgroundColor: '#A55EEA' }}>B</Avatar>
            <Avatar sx={{ backgroundColor: '#22A7F0' }}>C</Avatar>
          </AvatarGroup>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: `2px dashed ${colors.textSecondary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <AddIcon sx={{ fontSize: 16, color: colors.textSecondary }} />
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ mb: '32px' }}>
        {dashLoading ? (
          <Skeleton variant="rounded" width="100%" height={120} />
        ) : (
          <SpendChart data={chartData} />
        )}
      </Box>

      {/* Error state */}
      {dashError && <ErrorCard message="Failed to load dashboard data" onRetry={refetchDash} />}
      {txnError && <ErrorCard message="Failed to load transactions" onRetry={refetchTxn} />}

      {/* Transactions */}
      {!isAuthenticated ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontSize: '16px', color: colors.textSecondary }}>
            Login to see your transactions
          </Typography>
        </Box>
      ) : txnLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={18} />
              <Skeleton width="60%" height={14} sx={{ mt: 1 }} />
            </Box>
            <Skeleton width={80} height={18} />
          </Box>
        ))
      ) : (
        <>
          {groupedTransactions.map((group) => (
            <TransactionGroup
              key={group.label}
              label={group.label}
              transactions={group.transactions}
            />
          ))}

          {hasNextPage && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
                sx={{
                  color: colors.chartBarActive,
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                }}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
