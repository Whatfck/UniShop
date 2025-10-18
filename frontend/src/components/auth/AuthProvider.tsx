import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { token, logout } = useAuthStore();

  useEffect(() => {
    // Check if token exists and is valid on app start
    if (token) {
      // TODO: Validate token with API
      // For now, we'll assume it's valid
      console.log('Token found, user is authenticated');
    }
  }, [token]);

  // TODO: Add token refresh logic
  // TODO: Add logout on token expiry

  return <>{children}</>;
}