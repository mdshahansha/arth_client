import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SpendChart } from '../components/dashboard/SpendChart';
import { useDashboard } from '../hooks/useDashboard';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { formatAmount } from '../utils/formatters';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';

const insights = [
  { icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, tone: '#31BA96', text: 'Income grew 3.1% while expenses rose 8.2% — watch discretionary spend.' },
  { icon: <ShoppingBagIcon sx={{ fontSize: 18 }} />, tone: '#B548C6', text: 'Shopping is your fastest-growing category, up 22% vs last month.' },
  { icon: <CalendarMonthIcon sx={{ fontSize: 18 }} />, tone: '#167AFF', text: 'You stayed under budget on 18 of 25 days this month.' },
];

const aiRecs = [
  { title: 'Move 1.5M to Savings', body: 'You have idle cash in Main Account. Auto-transfer keeps your 20% goal on track.', cta: 'Set up' },
  { title: 'Cancel 2 subscriptions', body: 'Two services were unused for 60+ days. Cancelling saves ~180.000 / month.', cta: 'Review' },
];

const weeklyData = [
  { day: 1, value: 38, label: 'Mon' },
  { day: 2, value: 52, label: 'Tue' },
  { day: 3, value: 41, label: 'Wed' },
  { day: 4, value: 60, label: 'Thu' },
  { day: 5, value: 48, label: 'Fri' },
  { day: 6, value: 72, label: 'Sat' },
  { day: 7, value: 66, label: 'Sun' },
];

export const SummaryPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: dashboard, loading } = useDashboard();

  const totalIncome = dashboard?.totalIncome || 0;
  const totalExpenses = dashboard?.totalSpend || 0;
  const netProfit = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const chartData = dashboard?.monthlyBreakdown?.map((m, i) => ({
    day: i + 1, value: m.debit || 0, label: m.month,
  }));

  if (!isAuthenticated) {
    return (
      <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography sx={{ color: colors.textSecondary, fontSize: 16 }}>Login to view summary</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: { xs: 0, md: `${spacing.cardBorderRadius}px` }, p: { xs: '20px 16px', sm: '30px 24px', md: '40px 44px' }, minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '28px', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>Executive Summary</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>Your financial health at a glance.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ color: colors.textPrimary, borderColor: colors.divider, textTransform: 'none', fontWeight: 600 }}>Export report</Button>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: '20px', mb: '28px' }}>
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: '16px' }} />) : (
          <>
            <KpiCard colors={colors} icon={<ArrowDownwardIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#31BA96" label="Revenue" value={formatAmount(totalIncome)} delta="3.1%" up />
            <KpiCard colors={colors} icon={<TrendingUpIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#FF8701" label="Expenses" value={formatAmount(totalExpenses)} delta="8.2%" up />
            <KpiCard colors={colors} icon={<AccountBalanceWalletIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#B548C6" label="Net Profit" value={formatAmount(netProfit)} delta="1.4%" up={false} />
            <KpiCard colors={colors} icon={<SavingsIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#32A7E2" label="Savings Rate" value={`${savingsRate}%`} delta="2.0%" up />
          </>
        )}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: '28px', mb: '28px', alignItems: 'start' }}>
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '8px' }}>Revenue vs Expenses</Typography>
          <Box sx={{ display: 'flex', gap: '18px', mb: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#167AFF' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary }}>Revenue</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#31BA96' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary }}>Net</Typography>
            </Box>
          </Box>
          {loading ? <Skeleton variant="rounded" height={150} /> : <SpendChart data={chartData} />}
        </Box>

        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '6px' }}>Weekly Trend</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary, mb: '18px' }}>Spend by day of week</Typography>
          <SpendChart data={weeklyData} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '10px' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Typography key={i} sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary }}>{d}</Typography>
            ))}
          </Box>
          <Box sx={{ mt: '20px', pt: '18px', borderTop: `1px solid ${colors.divider}`, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>Best day</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.textPrimary, mt: '3px' }}>Sunday</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>Weekly avg</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.textPrimary, mt: '3px' }}>{formatAmount(53857)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Insights + AI Recommendations */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '28px', alignItems: 'start' }}>
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '18px' }}>Business Insights</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {insights.map((it, i) => (
              <Box key={i} sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '14px', backgroundColor: `${it.tone}18`, color: it.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {it.icon}
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, lineHeight: 1.55 }}>{it.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* AI Recommendations - Dark Card */}
        <Box sx={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #262A40 100%)', borderRadius: '20px', p: '24px', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '18px' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '14px', backgroundColor: '#167AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800 }}>AI Recommendations</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {aiRecs.map((a, i) => (
              <Box key={i} sx={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', p: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 800 }}>{a.title}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', mt: '4px', lineHeight: 1.5 }}>{a.body}</Typography>
                </Box>
                <Button variant="contained" size="small" sx={{ backgroundColor: '#167AFF', textTransform: 'none', fontWeight: 700, borderRadius: '10px', '&:hover': { backgroundColor: '#1268DD' } }}>{a.cta}</Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function KpiCard({ colors, icon, iconBg, label, value, delta, up }: {
  colors: any; icon: React.ReactNode; iconBg: string; label: string; value: string; delta: string; up: boolean;
}) {
  return (
    <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>{label}</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.02em' }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: up ? '#31BA96' : '#EC4848' }}>{up ? '▲' : '▼'} {delta}</Typography>
      </Box>
    </Box>
  );
}
