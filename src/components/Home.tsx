import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page, Product } from '../App';

interface HomeProps {
  onNavigate: (page: Page, productId?: string) => void;
  addToCart: (product: Product) => void;
}

export function Home({ onNavigate, addToCart }: HomeProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Show first 4 products as featured
        setFeaturedProducts(data.products.slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlfGVufDF8fHx8MTc2NzM4MTQ0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Luxury Perfumes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl mb-4 tracking-wide">
            M&A Perfumes
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Discover Your Signature Scent
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('products')}
            className="bg-white text-black hover:bg-gray-100"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Featured Fragrances</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collection of premium perfumes
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => onNavigate('product-detail', product.id)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white px-4 py-2 bg-red-600 rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <h3 className="mb-2 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600">PKR {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No products available yet</p>
            <p className="text-sm text-gray-500">Please check back soon or contact us for more information</p>
          </div>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('products')}
            >
              View All Products
            </Button>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6">Why Choose M&A Perfumes?</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1">Premium Quality</h3>
                    <p className="text-gray-600">Authentic fragrances from renowned brands</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1">Cash on Delivery</h3>
                    <p className="text-gray-600">Pay when your order arrives at your doorstep</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1">Fast Delivery</h3>
                    <p className="text-gray-600">Delivery across Pakistan within 3-5 business days</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1">Customer Support</h3>
                    <p className="text-gray-600">Dedicated support team ready to assist you</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655500061669-1f8ac338a319?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwY29sbGVjdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzY3NDU5MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Perfume Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}