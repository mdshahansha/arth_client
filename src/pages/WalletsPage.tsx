import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { formatAmount, formatTransactionAmount, formatTime } from '../utils/formatters';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';
import { CategoryIcon } from '../components/common/CategoryIcon';
import type { TransactionCategory } from '../types';

const wallets = [
  { id: 1, name: 'Main Account', type: 'Bank', icon: 'bank', color: '#167AFF', number: '•••• 4821', balance: 12480500 },
  { id: 2, name: 'Cash Wallet', type: 'Cash', icon: 'wallet', color: '#31BA96', number: 'Physical', balance: 1340000 },
  { id: 3, name: 'Credit Card', type: 'Credit', icon: 'credit', color: '#B548C6', number: '•••• 9034', balance: -2160000 },
  { id: 4, name: 'Savings', type: 'Savings', icon: 'savings', color: '#FF8701', number: 'Goal 80%', balance: 24500000 },
];

const walletIcons: Record<string, React.ReactNode> = {
  bank: <AccountBalanceIcon sx={{ fontSize: 22 }} />,
  wallet: <AccountBalanceWalletIcon sx={{ fontSize: 22 }} />,
  credit: <CreditCardIcon sx={{ fontSize: 22 }} />,
  savings: <SavingsIcon sx={{ fontSize: 22 }} />,
};

const timeline = [
  { icon: <ArrowDownwardIcon sx={{ fontSize: 17 }} />, color: '#31BA96', title: 'Salary received', meta: 'Main Account · Today', amount: '+8.500.000' },
  { icon: <RepeatIcon sx={{ fontSize: 17 }} />, color: '#167AFF', title: 'Transfer to Savings', meta: 'Main → Savings · Yesterday', amount: '−2.000.000' },
  { icon: <CreditCardIcon sx={{ fontSize: 17 }} />, color: '#B548C6', title: 'Credit card payment', meta: 'Credit Card · 22 Mar', amount: '−1.150.000' },
  { icon: <AccountBalanceWalletIcon sx={{ fontSize: 17 }} />, color: '#FF8701', title: 'Cash withdrawal', meta: 'Main Account · 21 Mar', amount: '−500.000' },
];

export const WalletsPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: dashboard } = useDashboard();
  const { items: transactions } = useTransactions();

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const totalIncome = dashboard?.totalIncome || 9860000;
  const totalExpenses = dashboard?.totalSpend || 3420100;

  if (!isAuthenticated) {
    return (
      <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography sx={{ color: colors.textSecondary, fontSize: 16 }}>Login to view wallets</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: '40px 44px', minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '28px' }}>
        <Box>
          <Typography sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>Wallets</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>All your accounts in one place.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<SwapHorizIcon />} sx={{ color: colors.textPrimary, borderColor: colors.divider, textTransform: 'none', fontWeight: 600 }}>Transfer</Button>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: colors.loginButton, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: colors.chartBarActive } }}>Add Wallet</Button>
        </Box>
      </Box>

      {/* Hero: Total Balance + Distribution */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '28px', mb: '28px', alignItems: 'stretch' }}>
        {/* Total Balance Dark Card */}
        <Box sx={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #262A40 100%)', borderRadius: '24px', p: '32px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Total Balance</Typography>
            <Typography sx={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', mt: '10px' }}>{formatAmount(totalBalance)}</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', mt: '12px', fontSize: 13, fontWeight: 700, color: '#31BA96' }}>
              <TrendingUpIcon sx={{ fontSize: 16 }} /> +6.4% this month
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '28px', mt: '28px' }}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Income</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, mt: '4px' }}>{formatAmount(totalIncome)}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Expenses</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, mt: '4px' }}>{formatAmount(totalExpenses)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Balance Distribution */}
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', alignItems: 'center', gap: '24px', transition: 'background-color 0.3s ease' }}>
          {/* Simple donut placeholder */}
          <Box sx={{ width: 160, height: 160, borderRadius: '50%', border: `22px solid ${colors.divider}`, borderTopColor: '#167AFF', borderRightColor: '#31BA96', borderBottomColor: '#FF8701', borderLeftColor: '#B548C6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary }}>4</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>Wallets</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary, mb: '14px' }}>Balance Distribution</Typography>
            {wallets.map((w) => (
              <Box key={w.id} sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '11px', fontSize: 13, fontWeight: 700 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: w.color }} />
                <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{w.name}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: w.balance < 0 ? '#EC4848' : colors.textPrimary }}>{formatAmount(w.balance)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Wallet Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', mb: '28px' }}>
        {wallets.map((w) => (
          <Box key={w.id} sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'background-color 0.3s ease', cursor: 'pointer', '&:hover': { boxShadow: '0 4px 12px rgba(38,42,64,0.08)' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ width: 46, height: 46, borderRadius: '14px', backgroundColor: `${w.color}18`, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {walletIcons[w.icon]}
              </Box>
              <Box sx={{ px: '10px', py: '4px', borderRadius: '8px', backgroundColor: `${colors.divider}80`, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>{w.type}</Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.textSecondary }}>{w.name}</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 800, color: w.balance < 0 ? '#EC4848' : colors.textPrimary, mt: '6px', letterSpacing: '-0.02em' }}>{formatAmount(w.balance)}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, mt: '6px' }}>{w.number}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Activity Timeline + Recent Transactions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Recent Wallet Transactions */}
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '8px' }}>Recent Wallet Transactions</Typography>
          {transactions.slice(0, 4).map((t) => (
            <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: '14px', py: '14px', borderBottom: `1px solid ${colors.divider}` }}>
              <CategoryIcon category={t.category as TransactionCategory} size={42} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{t.title}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>{t.category} · {formatTime(t.transaction_date)}</Typography>
              </Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: t.type === 'credit' ? '#31BA96' : colors.textPrimary }}>
                {formatTransactionAmount(t.amount, t.type)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Activity Timeline */}
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '20px' }}>Activity Timeline</Typography>
          <Box sx={{ pl: '8px' }}>
            {timeline.map((e, i) => (
              <Box key={i} sx={{ display: 'flex', gap: '16px', position: 'relative', pb: i === timeline.length - 1 ? 0 : '26px' }}>
                {i !== timeline.length - 1 && (
                  <Box sx={{ position: 'absolute', left: 17, top: 38, bottom: 0, width: 2, backgroundColor: colors.divider }} />
                )}
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: `${e.color}18`, color: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  {e.icon}
                </Box>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{e.title}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, mt: '2px' }}>{e.meta}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 800, color: e.amount.startsWith('+') ? '#31BA96' : colors.textPrimary }}>{e.amount}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
