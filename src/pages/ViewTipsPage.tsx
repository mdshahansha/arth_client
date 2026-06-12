import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PieChartIcon from '@mui/icons-material/PieChart';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SchoolIcon from '@mui/icons-material/School';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTips } from '../hooks/useTips';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';

const categories = ['All', 'Budgeting', 'Saving', 'Spending', 'Investing', 'Debt'];

const tipIcons: Record<string, React.ReactNode> = {
  trending: <TrendingUpIcon sx={{ fontSize: 20 }} />,
  savings: <SavingsIcon sx={{ fontSize: 20 }} />,
  shopping: <ShoppingBagIcon sx={{ fontSize: 20 }} />,
  wallet: <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />,
  pie: <PieChartIcon sx={{ fontSize: 20 }} />,
  graph: <AutoGraphIcon sx={{ fontSize: 20 }} />,
};

const quickWins = [
  { icon: <ContentCutIcon sx={{ fontSize: 18 }} />, text: 'Cancel 1 unused subscription', save: '₹180/mo' },
  { icon: <MonetizationOnIcon sx={{ fontSize: 18 }} />, text: 'Turn on round-up savings', save: '~₹95/mo' },
  { icon: <NotificationsOffIcon sx={{ fontSize: 18 }} />, text: 'Set a ₹15K weekly cap', save: 'varies' },
];

export const ViewTipsPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { tips, savedIds, loading, toggleSave } = useTips();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const featured = tips.find((t) => t.featured);
  const filtered = tips.filter((t) => {
    if (t.featured) return false;
    if (activeCat !== 'All' && t.category !== activeCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q);
    }
    return true;
  });

  const savedTips = tips.filter((t) => savedIds.includes(t.id));

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: { xs: 0, md: `${spacing.cardBorderRadius}px` }, p: { xs: '20px 16px', sm: '30px 24px', md: '40px 44px' }, minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '28px', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>View Tips</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>Personalized recommendations to grow your money.</Typography>
        </Box>
        <TextField size="small" placeholder="Search tips & articles..." value={search} onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: colors.textSecondary }} /></InputAdornment> } }}
          sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: colors.rightPanelBg } }} />
      </Box>

      <Box role="tablist" aria-label="Filter tips by category" sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: '28px' }}>
        {categories.map((c) => {
          const on = activeCat === c;
          return (
            <Box key={c} role="tab" tabIndex={0} aria-selected={on} onClick={() => setActiveCat(c)}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveCat(c); } }}
              sx={{ px: '18px', py: '9px', borderRadius: '50px', cursor: 'pointer', fontSize: 14, fontWeight: 700, backgroundColor: on ? '#167AFF' : colors.rightPanelBg, color: on ? '#fff' : colors.textSecondary, transition: 'background-color 0.2s ease, color 0.2s ease', '&:hover': { backgroundColor: on ? '#167AFF' : colors.divider } }}>
              {c}
            </Box>
          );
        })}
      </Box>

      {loading ? (
        <Box aria-live="polite" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' }, gap: '28px' }}>
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: '24px' }} aria-label="Loading tips" />
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: '20px' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' }, gap: '28px', alignItems: 'start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {featured && (
              <Box sx={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #262A40 100%)', borderRadius: '24px', p: '32px', color: '#fff', display: 'flex', gap: '28px', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Chip label={`Featured · ${featured.category}`} size="small" sx={{ fontWeight: 700, backgroundColor: '#167AFF', color: '#fff', mb: '16px' }} />
                  <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em', mb: '10px' }}>{featured.title}</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 440 }}>{featured.body}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mt: '22px' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#167AFF', textTransform: 'none', fontWeight: 700 }}>Read guide</Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>
                      <AccessTimeIcon sx={{ fontSize: 15 }} /> {featured.read_time} read
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: 160, height: 120, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <SavingsIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)' }} />
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '20px' }}>
              {filtered.map((t) => (
                <Box key={t.id} sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '22px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'background-color 0.3s ease' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: '#167AFF18', color: '#167AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tipIcons[t.icon] || <TrendingUpIcon sx={{ fontSize: 20 }} />}
                    </Box>
                    {isAuthenticated && (
                      <IconButton size="small" aria-label={savedIds.includes(t.id) ? `Remove ${t.title} from saved` : `Save ${t.title}`} onClick={() => toggleSave(t.id)} sx={{ color: savedIds.includes(t.id) ? '#167AFF' : colors.textSecondary }}>
                        {savedIds.includes(t.id) ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    )}
                  </Box>
                  <Box>
                    <Chip label={t.category} size="small" sx={{ fontSize: 12, fontWeight: 600, backgroundColor: `${colors.divider}80`, color: colors.textPrimary, mb: '10px' }} />
                    <Typography sx={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary, mb: '6px' }}>{t.title}</Typography>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: colors.textSecondary, lineHeight: 1.55 }}>{t.body}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: '6px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                      <AccessTimeIcon sx={{ fontSize: 14 }} /> {t.read_time} read
                    </Box>
                    <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />} sx={{ textTransform: 'none', fontWeight: 700, color: colors.textSecondary }}>Read</Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '16px' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '14px', backgroundColor: '#31BA9618', color: '#31BA96', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlashOnIcon sx={{ fontSize: 17 }} />
                </Box>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>Quick Wins</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quickWins.map((q, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 14px', backgroundColor: colors.cardBg, borderRadius: '14px' }}>
                    <Box sx={{ color: colors.textSecondary }}>{q.icon}</Box>
                    <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: colors.textPrimary }}>{q.text}</Typography>
                    <Chip label={q.save} size="small" sx={{ fontWeight: 700, backgroundColor: '#31BA9618', color: '#31BA96' }} />
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', transition: 'background-color 0.3s ease' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '14px' }}>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>Saved Tips</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary }}>{savedTips.length}</Typography>
              </Box>
              {savedTips.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, py: '10px' }}>
                  {isAuthenticated ? 'No saved tips yet. Bookmark tips to see them here.' : 'Login to save tips.'}
                </Typography>
              ) : savedTips.map((t) => (
                <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', gap: '12px', py: '10px', borderTop: `1px solid ${colors.divider}` }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '14px', backgroundColor: '#167AFF18', color: '#167AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {tipIcons[t.icon] || <TrendingUpIcon sx={{ fontSize: 16 }} />}
                  </Box>
                  <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{t.title}</Typography>
                  <BookmarkIcon sx={{ fontSize: 16, color: '#167AFF' }} />
                </Box>
              ))}
            </Box>

            <Box sx={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #262A40 100%)', borderRadius: '20px', p: '24px', color: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '14px' }}>
                <SchoolIcon sx={{ fontSize: 20 }} />
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800 }}>Learning Resources</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, mb: '18px' }}>
                Short lessons on budgeting, saving and investing — learn at your own pace.
              </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#167AFF', textTransform: 'none', fontWeight: 700 }}>Browse library</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
