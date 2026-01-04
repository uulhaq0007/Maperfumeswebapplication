import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page, CartItem } from '../App';

interface CheckoutProps {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  clearCart: () => void;
}

export function Checkout({ cart, onNavigate, clearCart }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(200);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/settings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDeliveryCharge(data.settings.deliveryCharge || 200);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName || !formData.phone || !formData.city || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^(\+92|0)?3[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Pakistani phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            items: cart,
            total: subtotal,
            deliveryCharge,
            grandTotal: total,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.order.orderNumber);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add items to your cart to checkout</p>
          <Button onClick={() => onNavigate('products')} size="lg">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl mb-4">Order Placed Successfully!</h1>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-600 mb-2">Your Order Number</p>
            <p className="text-3xl mb-4">{orderNumber}</p>
            <p className="text-sm text-gray-600">
              Please save this number to track your order
            </p>
          </div>

          <div className="space-y-4 mb-8 text-left bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl mb-4 text-center">What's Next?</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700">We'll confirm your order within 24 hours</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700">Your order will be shipped within 1-2 business days</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700">Track your order anytime using your order number</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm flex-shrink-0">
                  4
                </div>
                <p className="text-gray-700">Pay cash when your order arrives (3-5 business days)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('order-tracking')} size="lg">
              Track Your Order
            </Button>
            <Button onClick={() => onNavigate('home')} variant="outline" size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('cart')}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <h1 className="text-3xl md:text-4xl mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-6">Delivery Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="03XX XXXXXXX"
                    type="tel"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll use this number for order updates
                  </p>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Karachi, Lahore, Islamabad"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="House/Flat number, Street, Area, Landmarks"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-4">Payment Method</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900">💵 Cash on Delivery (COD)</p>
                <p className="text-sm text-green-700 mt-1">
                  Pay in cash when your order is delivered to your doorstep
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>PKR {deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}