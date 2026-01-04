import { useState, useEffect } from 'react';
import { ShoppingCart, Eye } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';
import type { Order } from '../../App';

interface OrdersTabProps {
  adminToken: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function OrdersTab({ adminToken }: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/orders`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success('Order status updated!');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const data = await response.json();
          setSelectedOrder(data.order);
        }
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      console.error('Update order error:', error);
      toast.error('Failed to update order');
    }
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Orders</h2>
        <div className="text-sm text-gray-600">
          Total: {orders.length} orders
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4">Order #</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <span>{order.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div>{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="p-4">PKR {order.grandTotal.toLocaleString()}</td>
                    <td className="p-4">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className={`w-32 ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No orders yet</p>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Order Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                  >
                    <SelectTrigger className={statusColors[selectedOrder.status]}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">City:</span>
                      <span>{selectedOrder.city}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Address:</span>
                      <span className="text-right max-w-xs">{selectedOrder.address}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Notes:</span>
                        <span className="text-right max-w-xs">{selectedOrder.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
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
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>PKR {selectedOrder.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges:</span>
                      <span>PKR {selectedOrder.deliveryCharge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                      <span>Grand Total:</span>
                      <span>PKR {selectedOrder.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Order placed: {formatDate(selectedOrder.createdAt)}</div>
                  <div>Last updated: {formatDate(selectedOrder.updatedAt)}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}