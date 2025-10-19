import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui';
import type { Theme } from '../../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  theme: Theme;
  onThemeToggle: () => void;
}

const Header = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isAuthenticated = false,
  user,
  theme,
  onThemeToggle
}: HeaderProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <span style={{ color: 'var(--color-primary)' }}>Uni</span>
              <span style={{ color: 'var(--color-secondary)' }}>Shop</span>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-20 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-4"
                disabled={!searchQuery.trim()}
              >
                Buscar
              </Button>
            </form>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden flex-1 max-w-xs mx-4">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)'
              }}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Buscar...</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors hidden md:flex"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <>
                <Button variant="secondary" size="sm">
                  Vender
                </Button>
                <div className="relative">
                  <img
                    src={user?.avatar || '/api/placeholder/40/40'}
                    alt="Perfil"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  Iniciar Sesión
                </Button>
                <Button variant="primary" size="sm">
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-20 py-2 rounded-lg border focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-4"
                disabled={!searchQuery.trim()}
              >
                Buscar
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;