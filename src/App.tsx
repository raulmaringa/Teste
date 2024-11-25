import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { useAuthStore } from './store/authStore';
import { supabase } from './supabaseClient';
import { CustomerList } from './components/Customers/CustomerList';
import { AttendanceList } from './components/Attendances/AttendanceList';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Layout } from './components/Layout/Layout';
import { LoadingScreen } from './components/Common/LoadingScreen';
import { AttendantList } from './components/Attendants/AttendantList';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const { user, loading, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ThemeProvider theme={muiTheme}>
          <Router>
            <Routes>
              <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginForm />}
              />
              <Route
                path="/register"
                element={user ? <Navigate to="/" replace /> : <RegisterForm />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <CustomerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendances"
                element={
                  <ProtectedRoute>
                    <AttendanceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendants"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AttendantList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
