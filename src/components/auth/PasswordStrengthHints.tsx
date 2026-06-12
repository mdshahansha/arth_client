import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useThemeColors } from '../../hooks/useThemeColors';

interface PasswordStrengthHintsProps {
  password: string;
}

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export const PasswordStrengthHints: React.FC<PasswordStrengthHintsProps> = ({ password }) => {
  const colors = useThemeColors();
  return (
    <Box sx={{ mt: '8px' }}>
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '4px' }}>
            {passed ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: colors.tealGreen }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: colors.textSecondary }} />
            )}
            <Typography sx={{ fontSize: '12px', color: passed ? colors.tealGreen : colors.textSecondary }}>
              {rule.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
