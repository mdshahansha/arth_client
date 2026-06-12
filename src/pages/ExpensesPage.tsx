import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { SpendChart } from '../components/dashboard/SpendChart';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { ProgressBar } from '../components/common/ProgressBar';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { formatAmount, formatTransactionAmount, formatTime } from '../utils/formatters';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';
import { AddExpenseModal } from '../components/common/AddExpenseModal';
import type { Transaction, TransactionCategory } from '../types';

const categoryLabels: Record<string, string> = {
  food: 'Food and Drinks',
  shopping: 'Shopping',
  bills: 'Housing',
  travel: 'Transportation',
  entertainment: 'Entertainment',
};

const statusColors: Record<string, string> = {
  completed: '#31BA96',
  pending: '#FF8701',
  failed: '#EC4848',
};

export const ExpensesPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: dashboard, loading: dashLoading, categories, refetch: refetchDash } = useDashboard();
  const { items: transactions, loading: txnLoading, hasNextPage, loadingMore, fetchNextPage, refetch: refetchTxn } = useTransactions();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const [addOpen, setAddOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!dashboard?.monthlyBreakdown) return undefined;
    return dashboard.monthlyBreakdown.map((m, i) => ({
      day: i + 1,
      value: m.debit || 0,
      label: m.month,
    }));
  }, [dashboard]);

  const filteredTxns = useMemo(() => {
    let list = transactions;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (catFilter !== 'all') {
      list = list.filter((t) => t.category === catFilter);
    }
    return list;
  }, [transactions, search, catFilter]);

  const totalSpent = dashboard?.totalSpend || 0;
  const avgPerDay = totalSpent > 0 ? Math.round(totalSpent / 25) : 0;
  const largestTxn = useMemo(() => {
    if (!transactions.length) return null;
    return transactions.reduce((max, t) => {
      const amt = Math.abs(Number(t.amount));
      return amt > Math.abs(Number(max.amount)) ? t : max;
    }, transactions[0]);
  }, [transactions]);

  const maxCatAmount = Math.max(...(categories || []).map((c) => c.amount), 1);
  const closeExportMenu = () => setExportAnchor(null);

  const handleExport = (format: ExportFormat) => {
    closeExportMenu();
    exportTransactions(filteredTxns, format);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography sx={{ color: colors.textSecondary, fontSize: 16 }}>Login to view expenses</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: { xs: 0, md: `${spacing.cardBorderRadius}px` }, p: { xs: '20px 16px', sm: '30px 24px', md: '40px 44px' }, minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '28px', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>Expenses</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>Track and manage your spending</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled={filteredTxns.length === 0}
            onClick={(event) => setExportAnchor(event.currentTarget)}
            sx={{ color: colors.textPrimary, borderColor: colors.divider, textTransform: 'none', fontWeight: 600 }}
          >
            Export
          </Button>
          <Menu
            anchorEl={exportAnchor}
            open={Boolean(exportAnchor)}
            onClose={closeExportMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleExport('csv')}>CSV</MenuItem>
            <MenuItem onClick={() => handleExport('excel')}>Excel sheet</MenuItem>
            <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
          </Menu>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ backgroundColor: colors.loginButton, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: colors.chartBarActive } }}>Add Expense</Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: '20px', mb: '28px' }}>
        {dashLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: '16px' }} />)
        ) : (
          <>
            <StatCard colors={colors} icon={<TrendingUpIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#FF8701" label="Total Spent" value={formatAmount(totalSpent)} delta="8.2%" deltaUp />
            <StatCard colors={colors} icon={<CalendarTodayIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#32A7E2" label="Avg / Day" value={formatAmount(avgPerDay)} delta="2.0%" deltaUp={false} />
            <StatCard colors={colors} icon={<WhatshotIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#EC4848" label="Largest" value={largestTxn ? formatAmount(Math.abs(Number(largestTxn.amount))) : '0'} caption={largestTxn ? `${categoryLabels[largestTxn.category] || largestTxn.category}` : ''} />
          </>
        )}
      </Box>

      {/* Chart + Category Breakdown */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' }, gap: '28px', mb: '28px', alignItems: 'start' }}>
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '22px' }}>Monthly Expense Trend</Typography>
          {dashLoading ? <Skeleton variant="rounded" height={150} /> : <SpendChart data={chartData} />}
        </Box>
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mb: '18px' }}>Category Breakdown</Typography>
          {(categories || []).map((cat) => (
            <Box key={cat.category} sx={{ mb: '15px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '4px' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{categoryLabels[cat.category] || cat.category}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{formatAmount(cat.amount)}</Typography>
              </Box>
              <ProgressBar value={(cat.amount / maxCatAmount) * 100} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Transactions Table */}
      <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', transition: 'background-color 0.3s ease' }}>
        {/* Toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '20px 24px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mr: 'auto' }}>Recent Transactions</Typography>
          <TextField
            size="small" placeholder="Search transactions..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: colors.textSecondary }} /></InputAdornment> } }}
            sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: colors.cardBg } }}
          />
          <Select size="small" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} sx={{ width: 150, borderRadius: '10px', backgroundColor: colors.cardBg }}>
            <MenuItem value="all">All categories</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="shopping">Shopping</MenuItem>
            <MenuItem value="bills">Bills</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
            <MenuItem value="entertainment">Entertainment</MenuItem>
          </Select>
        </Box>

        {/* Table */}
        <Box sx={{ px: '24px', overflowX: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr', gap: 2, py: '12px', borderBottom: `1px solid ${colors.divider}`, minWidth: 700 }}>
            {['Transaction', 'Date', 'Category', 'Status', 'Amount'].map((h) => (
              <Typography key={h} sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Amount' ? 'right' : 'left' }}>{h}</Typography>
            ))}
          </Box>

          {txnLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr', gap: 2, py: '14px', borderBottom: `1px solid ${colors.divider}` }}>
                {Array.from({ length: 5 }).map((__, j) => <Skeleton key={j} width="80%" height={18} />)}
              </Box>
            ))
          ) : filteredTxns.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography sx={{ color: colors.textSecondary }}>No transactions found</Typography>
            </Box>
          ) : (
            filteredTxns.map((txn) => (
              <Box key={txn.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr', gap: 2, py: '14px', borderBottom: `1px solid ${colors.divider}`, alignItems: 'center', '&:hover': { backgroundColor: `${colors.divider}40` }, cursor: 'pointer', transition: 'background-color 150ms', minWidth: 700 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <CategoryIcon category={txn.category as TransactionCategory} size={42} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{txn.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>{txn.category}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{formatTime(txn.transaction_date)}</Typography>
                <Chip label={categoryLabels[txn.category] || txn.category} size="small" sx={{ fontSize: 12, fontWeight: 600, backgroundColor: `${colors.divider}80`, color: colors.textPrimary }} />
                <Chip label="Completed" size="small" sx={{ fontSize: 12, fontWeight: 600, backgroundColor: `${statusColors.completed}18`, color: statusColors.completed }} />
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: txn.type === 'credit' ? '#31BA96' : colors.textPrimary, textAlign: 'right' }}>
                  {formatTransactionAmount(txn.amount, txn.type)}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '18px 24px', borderTop: `1px solid ${colors.divider}` }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>
            Showing {filteredTxns.length} transactions
          </Typography>
          {hasNextPage && (
            <Button onClick={fetchNextPage} disabled={loadingMore} sx={{ color: colors.chartBarActive, textTransform: 'none', fontWeight: 600 }}>
              {loadingMore ? 'Loading...' : 'Load more'}
            </Button>
          )}
        </Box>
      </Box>
      <AddExpenseModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => { setAddOpen(false); refetchTxn(); refetchDash(); }} />
    </Box>
  );
};

type ExportFormat = 'csv' | 'excel' | 'pdf';

const exportHeaders = ['Transaction', 'Date', 'Category', 'Type', 'Status', 'Amount'];

function exportTransactions(transactions: Transaction[], format: ExportFormat): void {
  const rows = transactions.map((txn) => [
    txn.title,
    formatTime(txn.transaction_date),
    categoryLabels[txn.category] || txn.category,
    txn.type,
    'Completed',
    formatTransactionAmount(txn.amount, txn.type),
  ]);

  if (rows.length === 0) return;

  if (format === 'pdf') {
    exportPdf(rows);
    return;
  }

  if (format === 'excel') {
    downloadFile(
      `${getExportName()}.xls`,
      buildExcelDocument(rows),
      'application/vnd.ms-excel;charset=utf-8;',
    );
    return;
  }

  const csv = [exportHeaders, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
  downloadFile(`${getExportName()}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8;');
}

function exportPdf(rows: string[][]): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(buildPrintableDocument(rows));
  printWindow.document.close();
  printWindow.focus();
}

function buildExcelDocument(rows: string[][]): string {
  return `\uFEFF
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Expenses</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines /></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        ${buildHtmlTable([exportHeaders, ...rows])}
      </body>
    </html>
  `;
}

function buildPrintableDocument(rows: string[][]): string {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Expenses Export</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
          h1 { font-size: 22px; margin: 0 0 6px; }
          p { color: #6b7280; margin: 0 0 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background: #f3f4f6; }
          td:last-child, th:last-child { text-align: right; }
        </style>
      </head>
      <body>
        <h1>Expenses</h1>
        <p>Exported on ${escapeHtml(new Date().toLocaleString())}</p>
        ${buildHtmlTable([exportHeaders, ...rows])}
        <script>
          window.addEventListener('load', function () {
            window.print();
          });
        </script>
      </body>
    </html>
  `;
}

function buildHtmlTable(rows: string[][]): string {
  const [headers, ...bodyRows] = rows;

  return `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${bodyRows
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
          .join('')}
      </tbody>
    </table>
  `;
}

function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getExportName(): string {
  return `arth-expenses-${new Date().toISOString().slice(0, 10)}`;
}

function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function StatCard({ colors, icon, iconBg, label, value, delta, deltaUp, caption }: {
  colors: any; icon: React.ReactNode; iconBg: string; label: string; value: string; delta?: string; deltaUp?: boolean; caption?: string;
}) {
  return (
    <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>{label}</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.02em' }}>{value}</Typography>
        {delta && (
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: deltaUp ? '#31BA96' : '#EC4848' }}>
            {deltaUp ? '▲' : '▼'} {delta}
          </Typography>
        )}
        {caption && <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>{caption}</Typography>}
      </Box>
    </Box>
  );
}
