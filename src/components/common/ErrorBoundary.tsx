import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface Props {
  children: React.ReactNode;
  fallbackNav?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box role="alert" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', p: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 56, color: '#EC4848' }} />
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1F2233' }}>Something went wrong</Typography>
          <Typography sx={{ fontSize: 14, color: '#9A9CA5', maxWidth: 400, textAlign: 'center' }}>
            {this.state.error?.message || 'The page failed to load. This might be a temporary issue.'}
          </Typography>
          <Button variant="contained" onClick={this.handleRetry} sx={{ mt: 1, textTransform: 'none', fontWeight: 700, backgroundColor: '#3F4254', '&:hover': { backgroundColor: '#2F6BFF' } }}>
            Try again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
