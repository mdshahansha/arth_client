import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import { AppThemeProvider } from './context/ThemeContext';
import { AppShell } from './components/layout/AppShell';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { AuthListener } from './components/auth/AuthListener';
import { WelcomeSplash } from './components/common/WelcomeSplash';
import { useSSE } from './hooks/useSSE';
import './theme/global.css';

const SSEListener: React.FC = () => { useSSE(); return null; };

const App: React.FC = () => (
  <Provider store={store}>
    <AppThemeProvider>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <AuthListener />
      <SSEListener />
      <WelcomeSplash />
      <AppShell />
      <LoginModal />
      <RegisterModal />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Poppins', sans-serif",
          },
        }}
      />
    </AppThemeProvider>
  </Provider>
);

export default App;
