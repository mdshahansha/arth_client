import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import ExtensionIcon from '@mui/icons-material/Extension';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ShieldCheckIcon from '@mui/icons-material/VerifiedUser';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LockIcon from '@mui/icons-material/Lock';
import BarChartIcon from '@mui/icons-material/BarChart';
import CampaignIcon from '@mui/icons-material/Campaign';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MonitorIcon from '@mui/icons-material/Monitor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import { useThemeMode } from '../context/ThemeContext';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../hooks/useThemeColors';

const navSections = [
  { label: 'Profile', icon: <PersonIcon sx={{ fontSize: 18 }} /> },
  { label: 'Security', icon: <ShieldIcon sx={{ fontSize: 18 }} /> },
  { label: 'Notifications', icon: <NotificationsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Appearance', icon: <PaletteIcon sx={{ fontSize: 18 }} /> },
  { label: 'API & Integrations', icon: <ExtensionIcon sx={{ fontSize: 18 }} /> },
  { label: 'Billing', icon: <CreditCardIcon sx={{ fontSize: 18 }} /> },
];

export const SettingsPage: React.FC = () => {
  const colors = useThemeColors();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const { mode, toggleTheme } = useThemeMode();
  const [section, setSection] = useState('Profile');
  const [prefs, setPrefs] = useState({ product: true, security: true, marketing: false, weekly: true, twofa: true });

  if (!isAuthenticated) {
    return (
      <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Typography sx={{ color: colors.textSecondary, fontSize: 16 }}>Login to access settings</Typography>
      </Box>
    );
  }

  let content: React.ReactNode;

  if (section === 'Profile') {
    content = (
      <SettingsCard colors={colors} title="Profile Settings" desc="Update your personal information and avatar.">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', mb: '22px' }}>
          <Avatar src={user?.profile_image_url || undefined} sx={{ width: 72, height: 72, fontSize: 28 }}>{user?.name?.charAt(0)}</Avatar>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: colors.divider, color: colors.textPrimary }}>Change photo</Button>
            <Button size="small" sx={{ textTransform: 'none', color: colors.textSecondary }}>Remove</Button>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', mb: '22px' }}>
          <TextField label="Full name" defaultValue={user?.name || ''} fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          <TextField label="Email" defaultValue={user?.email || ''} fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          <TextField label="Phone" defaultValue="+62 812 3456 7890" fullWidth variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          <TextField label="Language" defaultValue="English (US)" fullWidth variant="outlined" size="small" select sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
            <MenuItem value="English (US)">English (US)</MenuItem>
            <MenuItem value="Bahasa Indonesia">Bahasa Indonesia</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button sx={{ textTransform: 'none', color: colors.textSecondary }}>Cancel</Button>
          <Button variant="contained" sx={{ textTransform: 'none', backgroundColor: colors.loginButton, '&:hover': { backgroundColor: colors.chartBarActive } }}>Save changes</Button>
        </Box>
      </SettingsCard>
    );
  } else if (section === 'Security') {
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SettingsCard colors={colors} title="Password Management" desc="Choose a strong password you don't use elsewhere.">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', mb: '22px' }}>
            <TextField label="Current password" type="password" defaultValue="password" fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <Box />
            <TextField label="New password" type="password" placeholder="••••••••" fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <TextField label="Confirm password" type="password" placeholder="••••••••" fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" sx={{ textTransform: 'none', backgroundColor: colors.loginButton, '&:hover': { backgroundColor: colors.chartBarActive } }}>Update password</Button>
          </Box>
        </SettingsCard>
        <SettingsCard colors={colors} title="Two-Factor Authentication" desc="Add an extra layer of security to your account.">
          <PrefRow colors={colors} icon={<SmartphoneIcon sx={{ fontSize: 18 }} />} title="Authenticator app" desc="Use a TOTP app to generate codes"
            action={<Switch checked={prefs.twofa} onChange={(e) => setPrefs((p) => ({ ...p, twofa: e.target.checked }))} />} />
          <PrefRow colors={colors} icon={<ShieldCheckIcon sx={{ fontSize: 18, color: '#31BA96' }} />} title="Recovery codes" desc="10 unused codes remaining"
            action={<Button variant="outlined" size="small" sx={{ textTransform: 'none', borderColor: colors.divider, color: colors.textPrimary }}>View codes</Button>} />
        </SettingsCard>
      </Box>
    );
  } else if (section === 'Notifications') {
    content = (
      <SettingsCard colors={colors} title="Notification Preferences" desc="Pick what Arth can notify you about.">
        <PrefRow colors={colors} icon={<FlashOnIcon sx={{ fontSize: 18 }} />} title="Product updates" desc="New features and improvements"
          action={<Switch checked={prefs.product} onChange={(e) => setPrefs((p) => ({ ...p, product: e.target.checked }))} />} />
        <PrefRow colors={colors} icon={<LockIcon sx={{ fontSize: 18 }} />} title="Security alerts" desc="Sign-ins and password changes"
          action={<Switch checked={prefs.security} onChange={(e) => setPrefs((p) => ({ ...p, security: e.target.checked }))} />} />
        <PrefRow colors={colors} icon={<BarChartIcon sx={{ fontSize: 18 }} />} title="Weekly summary" desc="Your spending recap every Monday"
          action={<Switch checked={prefs.weekly} onChange={(e) => setPrefs((p) => ({ ...p, weekly: e.target.checked }))} />} />
        <PrefRow colors={colors} icon={<CampaignIcon sx={{ fontSize: 18 }} />} title="Tips & marketing" desc="Occasional offers and finance tips"
          action={<Switch checked={prefs.marketing} onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} />} />
      </SettingsCard>
    );
  } else if (section === 'Appearance') {
    content = (
      <SettingsCard colors={colors} title="Appearance & Theme" desc="Customize how Arth looks for you.">
        <Box sx={{ display: 'flex', gap: '16px', mb: '22px' }}>
          {([['light', 'Light', <LightModeIcon />], ['dark', 'Dark', <DarkModeIcon />], ['system', 'System', <MonitorIcon />]] as const).map(([key, label, icon]) => (
            <Box key={key} onClick={() => { if (key !== 'system' && key !== mode) toggleTheme(); }}
              sx={{ flex: 1, p: '18px', borderRadius: '16px', cursor: 'pointer', backgroundColor: colors.cardBg, border: `2px solid ${mode === key ? '#167AFF' : colors.divider}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'border-color 0.2s ease' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '14px', backgroundColor: key === 'dark' ? '#1C1C1E' : colors.rightPanelBg, color: key === 'dark' ? '#fff' : colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: mode === key ? '#167AFF' : colors.textPrimary }}>{label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <TextField label="Currency format" defaultValue="INR" fullWidth size="small" select sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
            <MenuItem value="INR">INR — ₹1,378.20</MenuItem>
            <MenuItem value="USD">USD — $1,378.20</MenuItem>
          </TextField>
          <TextField label="Language" defaultValue="English (US)" fullWidth size="small" select sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
            <MenuItem value="English (US)">English (US)</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
          </TextField>
        </Box>
      </SettingsCard>
    );
  } else if (section === 'API & Integrations') {
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <SettingsCard colors={colors} title="API Keys" desc="Use keys to connect Arth to your own tools.">
          {[['Production', 'arth_live_••••••8c21', '#31BA96'], ['Development', 'arth_test_••••••4f09', '#6B7280']].map(([env, key, tone]) => (
            <Box key={env as string} sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '14px 16px', backgroundColor: colors.rightPanelBg, borderRadius: '14px', mb: '10px' }}>
              <Chip label={env} size="small" sx={{ fontWeight: 700, backgroundColor: `${tone}18`, color: tone as string }} />
              <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: colors.textPrimary, fontFamily: 'monospace', letterSpacing: '0.02em' }}>{key}</Typography>
              <Button size="small" startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />} sx={{ textTransform: 'none', color: colors.textSecondary }}>Copy</Button>
              <Button size="small" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} sx={{ textTransform: 'none', color: colors.textSecondary }}>Rotate</Button>
            </Box>
          ))}
          <Button variant="outlined" startIcon={<AddIcon />} sx={{ textTransform: 'none', borderColor: colors.divider, color: colors.textPrimary, mt: '8px' }}>Generate new key</Button>
        </SettingsCard>
        <SettingsCard colors={colors} title="Integrations" desc="Connect the apps you already use.">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[['Slack', true], ['Google Sheets', true], ['Zapier', false], ['Notion', false]].map(([name, on]) => (
              <Box key={name as string} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '14px', border: `1px solid ${colors.divider}`, borderRadius: '14px' }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '14px', backgroundColor: colors.rightPanelBg, color: colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ExtensionIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography sx={{ flex: 1, fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{name}</Typography>
                <Button variant={on ? 'outlined' : 'contained'} size="small"
                  sx={{ textTransform: 'none', fontWeight: 600, ...(on ? { borderColor: colors.divider, color: colors.textPrimary } : { backgroundColor: colors.loginButton }) }}>
                  {on ? 'Connected' : 'Connect'}
                </Button>
              </Box>
            ))}
          </Box>
        </SettingsCard>
      </Box>
    );
  } else {
    content = (
      <SettingsCard colors={colors} title="Billing Settings" desc="Manage your plan and payment method.">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', p: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, #1C1C1E 0%, #262A40 100%)', color: '#fff', mb: '16px' }}>
          <Box sx={{ flex: 1 }}>
            <Chip label="Pro" size="small" sx={{ fontWeight: 700, backgroundColor: '#167AFF', color: '#fff', mb: '12px' }} />
            <Typography sx={{ fontSize: 26, fontWeight: 800 }}>₹1,499 <Typography component="span" sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>/ month</Typography></Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', mt: '4px' }}>Renews 1 July 2026</Typography>
          </Box>
          <Button variant="contained" sx={{ backgroundColor: '#167AFF', textTransform: 'none', fontWeight: 700 }}>Manage plan</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', py: '14px', borderTop: `1px solid ${colors.divider}` }}>
          <Box sx={{ width: 44, height: 30, borderRadius: '6px', backgroundColor: colors.rightPanelBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCardIcon sx={{ fontSize: 18, color: colors.textSecondary }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>Visa •••• 4821</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>Expires 09 / 26</Typography>
          </Box>
          <Button size="small" sx={{ textTransform: 'none', color: colors.textSecondary }}>Edit</Button>
        </Box>
      </SettingsCard>
    );
  }

  return (
    <Box sx={{ flex: 1, backgroundColor: colors.cardBg, borderRadius: `${spacing.cardBorderRadius}px`, p: '40px 44px', minHeight: '100vh', overflowY: 'auto', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ mb: '28px' }}>
        <Typography sx={{ fontSize: 34, fontWeight: 600, color: colors.textPrimary }}>Settings</Typography>
        <Typography sx={{ fontSize: 14, color: colors.textSecondary, mt: '4px' }}>Manage your account, security and preferences.</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Sidebar Nav */}
        <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '12px', position: 'sticky', top: 0, transition: 'background-color 0.3s ease' }}>
          {navSections.map(({ label, icon }) => {
            const on = section === label;
            return (
              <Box key={label} onClick={() => setSection(label)}
                sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '11px 14px', borderRadius: '14px', cursor: 'pointer', backgroundColor: on ? colors.cardBg : 'transparent', color: on ? colors.textPrimary : colors.textSecondary, fontWeight: 700, fontSize: 14.5, transition: 'background-color 150ms', '&:hover': { backgroundColor: colors.cardBg } }}>
                <Box sx={{ color: on ? '#167AFF' : colors.textSecondary }}>{icon}</Box>
                {label}
              </Box>
            );
          })}
        </Box>

        <Box>{content}</Box>
      </Box>
    </Box>
  );
};

function SettingsCard({ colors, title, desc, children }: { colors: any; title: string; desc: string; children: React.ReactNode }) {
  return (
    <Box sx={{ backgroundColor: colors.rightPanelBg, borderRadius: '20px', p: '24px', display: 'flex', flexDirection: 'column', gap: '22px', transition: 'background-color 0.3s ease' }}>
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary, mt: '4px' }}>{desc}</Typography>
      </Box>
      {children}
    </Box>
  );
}

function PrefRow({ colors, icon, title, desc, action }: { colors: any; icon: React.ReactNode; title: string; desc: string; action: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', py: '14px', borderTop: `1px solid ${colors.divider}` }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '14px', backgroundColor: colors.cardBg, color: colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary, mt: '2px' }}>{desc}</Typography>
      </Box>
      {action}
    </Box>
  );
}
