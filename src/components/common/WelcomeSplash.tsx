import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectShowWelcomeSplash,
  selectWelcomeName,
  dismissWelcomeSplash,
} from '../../features/auth/authSlice';

const TOTAL_DURATION = 3800; // Total visible time
const FADE_OUT_START = 3000; // When fade-out begins

export const WelcomeSplash: React.FC = () => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectShowWelcomeSplash);
  const name = useAppSelector(selectWelcomeName);
  const [phase, setPhase] = useState<'enter' | 'exit' | 'gone'>('enter');

  useEffect(() => {
    if (!show) {
      setPhase('gone');
      return;
    }

    setPhase('enter');

    const exitTimer = setTimeout(() => setPhase('exit'), FADE_OUT_START);
    const doneTimer = setTimeout(() => {
      setPhase('gone');
      dispatch(dismissWelcomeSplash());
    }, TOTAL_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [show, dispatch]);

  if (phase === 'gone' && !show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 50%, #000000 100%)',
        animation:
          phase === 'enter'
            ? 'splashFadeIn 500ms ease-out forwards'
            : phase === 'exit'
              ? 'splashFadeOut 800ms ease-in forwards'
              : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
    >
      {/* Floating particles background */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'rgba(47, 107, 255, 0.3)',
            animation: `splashParticle ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            left: `${15 + i * 13}%`,
            top: `${40 + (i % 3) * 10}%`,
          }}
        />
      ))}

      {/* Wave emoji */}
      <Typography
        sx={{
          fontSize: { xs: '48px', sm: '64px' },
          mb: '8px',
          opacity: 0,
          '@keyframes waveReveal': {
            '0%': { opacity: 0, transform: 'scale(0)' },
            '30%': { opacity: 1, transform: 'scale(1.2)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
          animation: 'waveReveal 0.6s ease-out 0.2s forwards, splashWave 1.8s ease-in-out 0.5s',
        }}
      >
        {'👋'}
      </Typography>

      {/* "Hi there, {name}" */}
      <Typography
        sx={{
          fontSize: { xs: '28px', sm: '38px', md: '46px' },
          fontWeight: 300,
          color: 'rgba(255, 255, 255, 0.9)',
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '-0.5px',
          opacity: 0,
          animation: 'splashTextUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
          textAlign: 'center',
          px: 2,
        }}
      >
        Hi there,{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            color: '#FFFFFF',
          }}
        >
          {name}
        </Box>
      </Typography>

      {/* Decorative line */}
      <Box
        sx={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(47, 107, 255, 0.6), transparent)',
          borderRadius: '2px',
          my: '20px',
          opacity: 0,
          animation: 'splashTextUp 0.6s ease-out 1s forwards, splashLine 0.8s ease-out 1s forwards',
        }}
      />

      {/* "Welcome to Arth" */}
      <Typography
        sx={{
          fontSize: { xs: '20px', sm: '26px', md: '30px' },
          fontWeight: 400,
          fontFamily: "'Poppins', sans-serif",
          color: 'rgba(255, 255, 255, 0.6)',
          opacity: 0,
          animation: 'splashTextUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards',
          textAlign: 'center',
          letterSpacing: '1px',
        }}
      >
        Welcome to{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '32px', md: '36px' },
            letterSpacing: '3px',
            background: 'linear-gradient(135deg, #2F6BFF 0%, #1BC5BD 50%, #A55EEA 100%)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'splashGradient 3s ease infinite, splashGlow 2s ease-in-out 1.5s infinite',
          }}
        >
          ARTH
        </Box>
      </Typography>

      {/* Subtle tagline */}
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.25)',
          mt: '32px',
          opacity: 0,
          animation: 'splashTextUp 0.6s ease-out 1.8s forwards',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Your finances, simplified
      </Typography>
    </Box>
  );
};
