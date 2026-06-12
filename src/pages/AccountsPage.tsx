import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';

const accounts = [
  { id: 1, name: 'Samantha Green', email: 'samantha@email.com', role: 'Owner', roleTone: '#B548C6', status: 'active', last: 'Just now' },
  { id: 2, name: 'Daniel Wright', email: 'daniel.w@email.com', role: 'Admin', roleTone: '#167AFF', status: 'active', last: '12 min ago' },
  { id: 3, name: 'Amara Okafor', email: 'amara.o@email.com', role: 'Member', roleTone: '#6B7280', status: 'active', last: '1 hr ago' },
  { id: 4, name: 'Lukas Meyer', email: 'lukas.m@email.com', role: 'Member', roleTone: '#6B7280', status: 'invited', last: 'Pending' },
  { id: 5, name: 'Priya Nair', email: 'priya.n@email.com', role: 'Viewer', roleTone: '#32A7E2', status: 'suspended', last: '3 days ago' },
];

const statusColor: Record<string, string> = { active: '#31BA96', invited: '#FF8701', suspended: '#EC4848' };

const permissions = [
  { role: 'Owner', color: '#B548C6', scopes: ['Full access', 'Billing', 'Delete account'] },
  { role: 'Admin', color: '#167AFF', scopes: ['Manage members', 'Edit data', 'Export'] },
  { role: 'Member', color: '#6B7280', scopes: ['View & add', 'Edit own data'] },
  { role: 'Viewer', color: '#32A7E2', scopes: ['Read-only access'] },
];

export const AccountsPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSel = selected.length === accounts.length;

  const filtered = accounts.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography sx={{ color: colors.textSecondary, fontSize: 16 }}>Login to manage accounts</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: '40px 44px', minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '28px' }}>
        <Box>
          <Typography sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>Accounts</Typography>
          <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>Manage members, roles and permissions.</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} sx={{ backgroundColor: colors.loginButton, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: colors.chartBarActive } }}>Invite member</Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', mb: '28px' }}>
        <MiniStat colors={colors} icon={<PeopleIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#32A7E2" label="Total Members" value="5" caption="2 admins" />
        <MiniStat colors={colors} icon={<PersonIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#31BA96" label="Active" value="3" caption="this week" />
        <MiniStat colors={colors} icon={<MailIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#FF8701" label="Pending Invites" value="1" caption="awaiting" />
        <MiniStat colors={colors} icon={<PersonOffIcon sx={{ color: '#fff', fontSize: 20 }} />} iconBg="#EC4848" label="Suspended" value="1" caption="review needed" />
      </Box>

      {/* Team Members Table */}
      <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', mb: '28px', transition: 'background-color 0.3s ease' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '20px 24px', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, mr: 'auto' }}>Team Members</Typography>
          <TextField size="small" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: colors.textSecondary }} /></InputAdornment> } }}
            sx={{ width: 220, '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: colors.cardBg } }}
          />
        </Box>

        <Box sx={{ px: '24px' }}>
          {/* Header Row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 48px', gap: 2, py: '12px', borderBottom: `1px solid ${colors.divider}`, alignItems: 'center' }}>
            <Checkbox checked={allSel} onChange={() => setSelected(allSel ? [] : accounts.map((a) => a.id))} size="small" />
            {['User', 'Role', 'Status', 'Last active', ''].map((h) => (
              <Typography key={h} sx={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</Typography>
            ))}
          </Box>

          {filtered.map((acc) => (
            <Box key={acc.id} sx={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 48px', gap: 2, py: '14px', borderBottom: `1px solid ${colors.divider}`, alignItems: 'center', cursor: 'pointer', '&:hover': { backgroundColor: `${colors.divider}40` }, transition: 'background-color 150ms' }}>
              <Checkbox checked={selected.includes(acc.id)} onChange={() => toggle(acc.id)} size="small" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar sx={{ width: 40, height: 40, fontSize: 14, fontWeight: 700, backgroundColor: acc.roleTone }}>{acc.name.charAt(0)}</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{acc.name}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>{acc.email}</Typography>
                </Box>
              </Box>
              <Chip label={acc.role} size="small" sx={{ fontWeight: 700, fontSize: 12, backgroundColor: `${acc.roleTone}18`, color: acc.roleTone }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor[acc.status] }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{acc.last}</Typography>
              <ChevronRightIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Permission Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {permissions.map((p) => (
          <Box key={p.role} sx={{ border: `1px solid ${colors.divider}`, borderRadius: '20px', p: '24px', transition: 'border-color 0.3s ease' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '14px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color }} />
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.textPrimary }}>{p.role}</Typography>
            </Box>
            {p.scopes.map((s, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '9px', mb: '9px' }}>
                <CheckIcon sx={{ fontSize: 15, color: '#31BA96' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>{s}</Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

function MiniStat({ colors, icon, iconBg, label, value, caption }: {
  colors: any; icon: React.ReactNode; iconBg: string; label: string; value: string; caption: string;
}) {
  return (
    <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>{label}</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary }}>{value}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>{caption}</Typography>
      </Box>
    </Box>
  );
}
