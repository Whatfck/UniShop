import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../stores/auth';

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Navigate to search results
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-xl">Unishop</span>
        </Link>

        {/* Search Bar - Hidden on mobile, shown on larger screens */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-primary-500"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-secondary-600 hover:text-primary-500">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Vender Button */}
          {isAuthenticated && (
            <Link to="/sell">
              <Button size="sm" className="hidden sm:flex">
                <PlusIcon className="h-4 w-4 mr-2" />
                Vender
              </Button>
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary-100">
                <UserIcon className="h-6 w-6" />
                <span className="hidden sm:block text-sm">{user?.name}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onLoginClick}>
                Iniciar Sesión
              </Button>
              <Button size="sm" onClick={onRegisterClick}>
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}