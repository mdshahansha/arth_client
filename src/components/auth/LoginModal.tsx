import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  loginThunk,
  openRegisterModal,
  closeLoginModal,
  selectIsLoginModalOpen,
  selectSessionExpired,
  selectLoginLoading,
  selectLoginError,
} from '../../features/auth/authSlice';
import { useThemeColors } from '../../hooks/useThemeColors';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginModal: React.FC = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsLoginModalOpen);
  const sessionExpired = useAppSelector(selectSessionExpired);
  const loading = useAppSelector(selectLoginLoading);
  const loginError = useAppSelector(selectLoginError);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(loginThunk({ email: data.email, password: data.password }));
    if (loginThunk.fulfilled.match(result)) {
      reset();
    }
  };

  const handleClose = () => dispatch(closeLoginModal());
  const handleSwitchToRegister = () => dispatch(openRegisterModal());

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)' } },
      }}
    >
      <Box
        className="fade-scale-in"
        sx={{
          width: 450,
          maxWidth: '90vw',
          backgroundColor: colors.modalBg,
          borderRadius: '16px',
          p: '48px 40px',
          outline: 'none',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', mb: '40px' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: colors.textPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2C10 2 6 6 6 10C6 14 10 18 10 18C10 18 14 14 14 10C14 6 10 2 10 2Z" fill="white" />
              <path d="M10 5C10 5 8 7 8 10C8 13 10 15 10 15C10 15 12 13 12 10C12 7 10 5 10 5Z" fill="#3F4254" />
            </svg>
          </Box>
          <Typography id="login-modal-title" sx={{ fontSize: '28px', fontWeight: 700, letterSpacing: '4px', color: colors.textPrimary }}>
            SMOKE
          </Typography>
        </Box>

        {/* Session expired warning */}
        {sessionExpired && (
          <Box role="alert" sx={{ mb: 3, p: 2, borderRadius: '8px', backgroundColor: colors.errorBg, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: colors.errorRed, fontWeight: 500 }}>
              Session expired. Please login again.
            </Typography>
          </Box>
        )}

        {/* API error */}
        {loginError && (
          <Box role="alert" sx={{ mb: 3, p: 2, borderRadius: '8px', backgroundColor: colors.errorBg, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: colors.errorRed, fontWeight: 500 }}>
              {loginError.message}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: '28px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>
              Email
            </Typography>
            <TextField
              {...register('email')}
              fullWidth
              variant="standard"
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ formHelperText: { sx: { color: colors.errorRed, fontSize: '12px' } } }}
            />
          </Box>

          <Box sx={{ mb: '12px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>
              Password
            </Typography>
            <TextField
              {...register('password')}
              type="password"
              fullWidth
              variant="standard"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{ formHelperText: { sx: { color: colors.errorRed, fontSize: '12px' } } }}
            />
          </Box>

          <Typography
            role="button"
            tabIndex={0}
            sx={{ fontSize: '12px', color: colors.textSecondary, mb: '32px', cursor: 'pointer', '&:hover': { color: colors.textPrimary } }}
          >
            Forgot Your Password?
          </Typography>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: colors.loginButton,
              color: '#fff',
              py: '14px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#2d3040' },
              '&:disabled': { backgroundColor: '#6b6d7a', color: '#ccc' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Enter'}
          </Button>
        </form>

        <Typography
          sx={{ fontSize: '13px', color: colors.textSecondary, mt: '20px', textAlign: 'center' }}
        >
          Don&apos;t have an account?{' '}
          <Box
            component="span"
            role="button"
            tabIndex={0}
            onClick={handleSwitchToRegister}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSwitchToRegister(); } }}
            sx={{ color: colors.chartBarActive, cursor: 'pointer', fontWeight: 500 }}
          >
            Register
          </Box>
        </Typography>
      </Box>
    </Modal>
  );
};
