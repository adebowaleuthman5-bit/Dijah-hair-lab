import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
