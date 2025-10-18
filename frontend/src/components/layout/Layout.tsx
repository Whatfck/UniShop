import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Layout({ children, onLoginClick, onRegisterClick }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}