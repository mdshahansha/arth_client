import React, { useEffect } from 'react';
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
  registerThunk,
  openLoginModal,
  closeRegisterModal,
  clearRegisterSuccess,
  selectIsRegisterModalOpen,
  selectRegisterLoading,
  selectRegisterError,
  selectRegisterSuccess,
} from '../../features/auth/authSlice';
import { PasswordStrengthHints } from './PasswordStrengthHints';
import { useThemeColors } from '../../hooks/useThemeColors';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  profileImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterModal: React.FC = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsRegisterModalOpen);
  const loading = useAppSelector(selectRegisterLoading);
  const registerError = useAppSelector(selectRegisterError);
  const registerSuccess = useAppSelector(selectRegisterSuccess);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', profileImageUrl: '' },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    await dispatch(
      registerThunk({
        name: data.name,
        email: data.email,
        password: data.password,
        profileImageUrl: data.profileImageUrl || undefined,
      }),
    );
  };

  /* Auto-redirect to login after successful registration */
  useEffect(() => {
    if (registerSuccess) {
      reset();
      const timer = setTimeout(() => {
        dispatch(clearRegisterSuccess());
        dispatch(closeRegisterModal());
        dispatch(openLoginModal());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, dispatch, reset]);

  const handleClose = () => dispatch(closeRegisterModal());
  const handleSwitchToLogin = () => dispatch(openLoginModal());

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="register-modal-title"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.5)' } } }}
    >
      <Box
        className="fade-scale-in"
        sx={{
          width: 450,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: colors.modalBg,
          borderRadius: '16px',
          p: '40px',
          outline: 'none',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', mb: '32px' }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: '10px', backgroundColor: colors.textPrimary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2C10 2 6 6 6 10C6 14 10 18 10 18C10 18 14 14 14 10C14 6 10 2 10 2Z" fill="white" />
              <path d="M10 5C10 5 8 7 8 10C8 13 10 15 10 15C10 15 12 13 12 10C12 7 10 5 10 5Z" fill="#3F4254" />
            </svg>
          </Box>
          <Typography id="register-modal-title" sx={{ fontSize: '28px', fontWeight: 700, letterSpacing: '4px', color: colors.textPrimary }}>
            SMOKE
          </Typography>
        </Box>

        {registerSuccess && (
          <Box role="status" aria-live="polite" sx={{ mb: 3, p: 2, borderRadius: '8px', backgroundColor: colors.successBg, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: colors.tealGreen, fontWeight: 500 }}>
              Registration successful! Redirecting to login...
            </Typography>
          </Box>
        )}

        {registerError && (
          <Box role="alert" sx={{ mb: 3, p: 2, borderRadius: '8px', backgroundColor: colors.errorBg, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: colors.errorRed, fontWeight: 500 }}>
              {registerError.message}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <Box sx={{ mb: '20px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>Name</Typography>
            <TextField {...register('name')} fullWidth variant="standard" error={!!errors.name} helperText={errors.name?.message} />
          </Box>

          {/* Email */}
          <Box sx={{ mb: '20px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>Email</Typography>
            <TextField {...register('email')} fullWidth variant="standard" error={!!errors.email} helperText={errors.email?.message} />
          </Box>

          {/* Password */}
          <Box sx={{ mb: '20px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>Password</Typography>
            <TextField {...register('password')} type="password" fullWidth variant="standard" error={!!errors.password} helperText={errors.password?.message} />
            <PasswordStrengthHints password={passwordValue} />
          </Box>

          {/* Profile URL */}
          <Box sx={{ mb: '28px' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, mb: '8px' }}>Profile Image URL (optional)</Typography>
            <TextField {...register('profileImageUrl')} fullWidth variant="standard" error={!!errors.profileImageUrl} helperText={errors.profileImageUrl?.message} />
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: colors.loginButton, color: '#fff', py: '14px', borderRadius: '6px',
              fontSize: '16px', fontWeight: 600, textTransform: 'none',
              '&:hover': { backgroundColor: '#2d3040' },
              '&:disabled': { backgroundColor: '#6b6d7a', color: '#ccc' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
          </Button>
        </form>

        <Typography sx={{ fontSize: '13px', color: colors.textSecondary, mt: '20px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Box component="span" role="button" tabIndex={0} onClick={handleSwitchToLogin} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSwitchToLogin(); } }} sx={{ color: colors.chartBarActive, cursor: 'pointer', fontWeight: 500 }}>
            Login
          </Box>
        </Typography>
      </Box>
    </Modal>
  );
};
