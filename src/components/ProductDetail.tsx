import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Package, Truck } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page, Product } from '../App';

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: Page) => void;
  addToCart: (product: Product) => void;
}

export function ProductDetail({ productId, onNavigate, addToCart }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/products/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        onNavigate('products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('products')}
        className="mb-8 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.category}</p>
            
            <div className="text-3xl mb-6">PKR {product.price.toLocaleString()}</div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5" />
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Fragrance Notes */}
            {(product.topNotes || product.middleNotes || product.baseNotes) && (
              <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl mb-4">Fragrance Notes</h2>
                <div className="space-y-3">
                  {product.topNotes && (
                    <div>
                      <span className="text-gray-600">Top Notes:</span>
                      <p className="text-gray-800">{product.topNotes}</p>
                    </div>
                  )}
                  {product.middleNotes && (
                    <div>
                      <span className="text-gray-600">Middle Notes:</span>
                      <p className="text-gray-800">{product.middleNotes}</p>
                    </div>
                  )}
                  {product.baseNotes && (
                    <div>
                      <span className="text-gray-600">Base Notes:</span>
                      <p className="text-gray-800">{product.baseNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Size</span>
                <span>{product.size}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Category</span>
                <span>{product.category}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-900">Free delivery across Pakistan</p>
                <p className="text-blue-700">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (product.stock > 0) {
                  addToCart(product);
                  onNavigate('checkout');
                }
              }}
              disabled={product.stock <= 0}
              className="w-full"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}