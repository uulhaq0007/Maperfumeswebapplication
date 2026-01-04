import { useState, useEffect } from 'react';
import { LogOut, Package, ShoppingCart, Users, MessageSquare, Settings } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { ComplaintsTab } from './ComplaintsTab';
import { SettingsTab } from './SettingsTab';
import type { Page } from '../../App';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

export function AdminDashboard({ adminToken, onLogout, onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl md:text-2xl">Admin Dashboard</h1>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('home')}
              >
                View Store
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <ProductsTab adminToken={adminToken} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab adminToken={adminToken} />
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <ComplaintsTab adminToken={adminToken} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab adminToken={adminToken} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}