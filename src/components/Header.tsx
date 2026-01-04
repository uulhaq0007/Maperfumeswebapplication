import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react@0.487.0';
import { useState } from 'react';
import { Button } from './ui/button';
interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  cartCount: number;
  isAdmin: boolean;
  onAdminLogout: () => void;
}

export function Header({ currentPage, onNavigate, cartCount, isAdmin, onAdminLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Products', page: 'products' as Page },
    { label: 'Track Order', page: 'order-tracking' as Page },
    { label: 'Contact', page: 'contact' as Page },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl md:text-3xl tracking-wider transition-opacity hover:opacity-70"
          >
            M&A Perfumes
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors hover:text-gray-600 ${
                  currentPage === item.page ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Admin Button */}
            {isAdmin ? (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Admin
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAdminLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('admin-login')}
                className="hidden md:flex gap-2"
              >
                <User className="w-4 h-4" />
                Admin
              </Button>
            )}

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 transition-colors hover:bg-gray-50 rounded ${
                    currentPage === item.page ? 'bg-gray-50' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('admin-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 transition-colors hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onAdminLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 transition-colors hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 transition-colors hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Admin Login
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}