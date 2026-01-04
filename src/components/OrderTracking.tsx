import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page, Order } from '../App';

interface OrderTrackingProps {
  onNavigate: (page: Page) => void;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  confirmed: { icon: CheckCircle, label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  shipped: { icon: Truck, label: 'Shipped', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  delivered: { icon: Package, label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-50' },
  cancelled: { icon: Package, label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-50' },
};

export function OrderTracking({ onNavigate }: OrderTrackingProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber || !phone) {
      toast.error('Please enter both order number and phone number');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/orders/track`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ orderNumber, phone }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        const errorData = await response.json();
        setOrder(null);
        toast.error(errorData.error || 'Order not found');
      }
    } catch (error) {
      console.error('Order tracking error:', error);
      setOrder(null);
      toast.error('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusProgress = (status: string) => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const index = statuses.indexOf(status);
    return index >= 0 ? ((index + 1) / statuses.length) * 100 : 0;
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl mb-4">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order number and phone number to check your order status
          </p>
        </div>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="mb-12">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="e.g., MA12345678"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Tracking...' : 'Track Order'}
              </Button>
            </div>
          </div>
        </form>

        {/* Order Details */}
        {searched && order && (
          <div className="space-y-6">
            {/* Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-6">Order Status</h2>

              <div className="mb-6">
                {(() => {
                  const StatusIcon = statusConfig[order.status]?.icon || Package;
                  const statusColor = statusConfig[order.status]?.color || 'text-gray-600';
                  const statusBg = statusConfig[order.status]?.bgColor || 'bg-gray-50';

                  return (
                    <div className={`flex items-center gap-3 p-4 ${statusBg} rounded-lg`}>
                      <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                      <div>
                        <p className={`${statusColor}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last updated: {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Progress Bar */}
              {order.status !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Pending</span>
                    <span>Confirmed</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getStatusProgress(order.status)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-6">Order Details</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span>{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Name</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span>{order.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Delivery Address</span>
                  <span className="text-right max-w-xs">{order.address}, {order.city}</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>PKR {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>PKR {order.deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>PKR {order.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-900 mb-2">Need Help?</p>
              <p className="text-sm text-blue-700 mb-4">
                If you have any questions about your order, please contact us
              </p>
              <Button onClick={() => onNavigate('contact')} variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
        )}

        {searched && !order && !loading && (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">Order not found</h3>
            <p className="text-gray-600">
              Please check your order number and phone number and try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
}