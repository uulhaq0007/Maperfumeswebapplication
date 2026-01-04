import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page, CartItem } from '../App';

interface CartProps {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export function Cart({ cart, onNavigate, updateQuantity, removeFromCart }: CartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 200 : 0;
  const total = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Discover our collection of premium fragrances
          </p>
          <Button onClick={() => onNavigate('products')} size="lg">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg"
            >
              {/* Image */}
              <div
                className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => onNavigate('product-detail', item.id)}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-grow">
                <h3
                  className="mb-1 cursor-pointer hover:text-gray-600"
                  onClick={() => onNavigate('product-detail', item.id)}
                >
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{item.size}</p>
                <p className="mb-3">PKR {item.price.toLocaleString()}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 border-x border-gray-300">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.quantity >= item.stock && (
                  <p className="text-xs text-amber-600 mt-2">
                    Maximum stock reached
                  </p>
                )}
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p>PKR {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>PKR {deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => onNavigate('checkout')}
              className="w-full mb-3"
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigate('products')}
              className="w-full"
            >
              Continue Shopping
            </Button>

            {/* Payment Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-900">
                <span>💵 Cash on Delivery Available</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                Pay when your order arrives
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}