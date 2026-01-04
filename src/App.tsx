import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Products } from './components/Products';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderTracking } from './components/OrderTracking';
import { Contact } from './components/Contact';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InitData } from './components/InitData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { createClient } from '@supabase/supabase-js@2';
import { projectId, publicAnonKey } from './utils/supabase/info';

export type Page = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout'
  | 'order-tracking'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'init-data';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  size: string;
  stock: number;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  status?: 'active' | 'inactive';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
  deliveryCharge: number;
  grandTotal: number;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('init-data');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ma-perfumes-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('ma-perfumes-cart', JSON.stringify(cart));
  }, [cart]);

  // Check for existing admin session
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAdminToken(data.session.access_token);
        // Verify admin status
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/admin/verify`,
          {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
            },
          }
        );
        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setAdminToken(null);
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const handleAdminLogin = async (token: string) => {
    setAdminToken(token);
    setIsAdmin(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setAdminToken(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateTo = (page: Page, productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && currentPage !== 'init-data' && (
        <Header
          currentPage={currentPage}
          onNavigate={navigateTo}
          cartCount={getCartCount()}
          isAdmin={isAdmin}
          onAdminLogout={handleAdminLogout}
        />
      )}

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={navigateTo} addToCart={addToCart} />
        )}
        {currentPage === 'products' && (
          <Products onNavigate={navigateTo} addToCart={addToCart} />
        )}
        {currentPage === 'product-detail' && selectedProductId && (
          <ProductDetail
            productId={selectedProductId}
            onNavigate={navigateTo}
            addToCart={addToCart}
          />
        )}
        {currentPage === 'cart' && (
          <Cart
            cart={cart}
            onNavigate={navigateTo}
            updateQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
          />
        )}
        {currentPage === 'checkout' && (
          <Checkout
            cart={cart}
            onNavigate={navigateTo}
            clearCart={clearCart}
          />
        )}
        {currentPage === 'order-tracking' && (
          <OrderTracking onNavigate={navigateTo} />
        )}
        {currentPage === 'contact' && (
          <Contact onNavigate={navigateTo} />
        )}
        {currentPage === 'admin-login' && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'admin-dashboard' && isAdmin && adminToken && (
          <AdminDashboard
            adminToken={adminToken}
            onLogout={handleAdminLogout}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'init-data' && (
          <InitData onNavigate={navigateTo} />
        )}
      </main>

      {currentPage !== 'admin-login' && currentPage !== 'admin-dashboard' && currentPage !== 'init-data' && (
        <Footer onNavigate={navigateTo} />
      )}

      <Toaster />
    </div>
  );
}