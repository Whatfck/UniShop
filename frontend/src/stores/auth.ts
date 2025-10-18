import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          // const response = await api.post('/auth/login', { email, password });

          // Mock successful login
          const mockUser: User = {
            id: '1',
            email,
            name: 'Usuario Demo',
            role: 'USER',
          };
          const mockToken = 'mock-jwt-token';

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // TODO: Store token in localStorage/httpOnly cookie
          localStorage.setItem('auth-token', mockToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          // TODO: Replace with actual API call
          // const response = await api.post('/auth/register', data);

          // Mock successful registration
          const mockUser: User = {
            id: '1',
            email: data.email,
            name: data.name,
            role: 'USER',
          };
          const mockToken = 'mock-jwt-token';

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('auth-token', mockToken);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-token');
      },

      updateProfile: async (data: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No authenticated user');

        try {
          // TODO: Replace with actual API call
          // const response = await api.patch('/auth/profile', data);

          // Mock profile update
          const updatedUser = { ...currentUser, ...data };
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);