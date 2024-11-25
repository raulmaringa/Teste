import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/Common/Layout/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { CustomerList } from '../pages/Customers/CustomerList';
import { CustomerForm } from '../pages/Customers/CustomerForm';
import { AttendanceList } from '../pages/Attendances/AttendanceList';
import { AttendanceForm } from '../pages/Attendances/AttendanceForm';
import { AttendantList } from '../pages/Attendants/AttendantList';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Auth/Login';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // TODO: Implementar lógica de autenticação
  const isAuthenticated = true;
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      
      <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
      <Route path="/customers/new" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
      <Route path="/customers/:id" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
      
      <Route path="/attendances" element={<PrivateRoute><AttendanceList /></PrivateRoute>} />
      <Route path="/attendances/new" element={<PrivateRoute><AttendanceForm /></PrivateRoute>} />
      <Route path="/attendances/:id" element={<PrivateRoute><AttendanceForm /></PrivateRoute>} />
      
      <Route path="/attendants" element={<PrivateRoute><AttendantList /></PrivateRoute>} />
      
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
