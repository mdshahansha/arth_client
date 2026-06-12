import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useThemeColors } from '../../hooks/useThemeColors';

interface BarData {
  day: number;
  value: number;
  label: string;
}

interface SpendChartProps {
  data?: BarData[];
}

function generatePlaceholderData(): BarData[] {
  return Array.from({ length: 25 }, (_, i) => ({
    day: i + 1,
    value: Math.random() * 80 + 20,
    label: `Day ${i + 1}`,
  }));
}

export const SpendChart: React.FC<SpendChartProps> = ({ data }) => {
  const colors = useThemeColors();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const bars = data || generatePlaceholderData();
  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '6px',
        height: 120,
        py: '16px',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {bars.map((bar, i) => {
        const heightPercent = (bar.value / maxVal) * 100;
        const isActive = hoveredBar === i || (hoveredBar === null && i === bars.length - 1);

        return (
          <Tooltip key={bar.day} title={bar.label} arrow placement="top">
            <Box
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
              sx={{
                width: 10,
                minWidth: 10,
                height: `${heightPercent}%`,
                backgroundColor: isActive ? colors.chartBarActive : colors.chartBarInactive,
                borderRadius: '4px 4px 2px 2px',
                cursor: 'pointer',
                transition: 'background-color 150ms, height 300ms ease-out',
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};
