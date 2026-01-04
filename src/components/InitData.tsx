import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { Loader2, CheckCircle, Database, Key, Package, ShoppingCart, MessageSquare } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Page } from '../App';

interface InitDataProps {
  onNavigate: (page: Page) => void;
}

export function InitData({ onNavigate }: InitDataProps) {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/init-data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      console.log('Init response:', data);

      if (!response.ok) {
        console.error('Init error details:', data);
        throw new Error(data.details || data.error || 'Failed to initialize data');
      }

      setResults(data);
      setInitialized(true);
      toast.success('Database initialized successfully!');
    } catch (error) {
      console.error('Init error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-amber-900 mb-2">M&A Perfumes</h1>
          <p className="text-slate-600">Database Initialization</p>
        </div>

        <Card className="border-amber-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-200">
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Database className="w-6 h-6" />
              Initialize Database
            </CardTitle>
            <CardDescription>
              Set up your database with sample products, orders, and an admin account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!initialized ? (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-amber-900 mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Admin Credentials
                  </h3>
                  <div className="space-y-2 bg-white rounded p-3 border border-amber-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Email:</span>
                      <code className="bg-slate-100 px-3 py-1 rounded">admin@maperfumes.com</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Password:</span>
                      <code className="bg-slate-100 px-3 py-1 rounded">Admin123!</code>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-blue-900">12 Products</div>
                    <div className="text-blue-600 text-sm">Sample perfumes</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-green-900">4 Orders</div>
                    <div className="text-green-600 text-sm">Sample orders</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-purple-900">3 Complaints</div>
                    <div className="text-purple-600 text-sm">Sample feedback</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="text-slate-900 mb-2">Test Order Tracking</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Order Number:</span>
                      <code className="bg-white px-2 py-1 rounded border">MA12345678</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phone:</span>
                      <code className="bg-white px-2 py-1 rounded border">+92-300-1234567</code>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleInitialize} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initializing Database...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-5 w-5" />
                      Initialize Database Now
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-green-900 mb-2">Successfully Initialized!</h3>
                  <p className="text-green-700">Your database has been set up with sample data.</p>
                </div>

                {results?.data && (
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                      <h3 className="text-slate-900 mb-3">Initialization Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-slate-600">Admin Account:</span>
                          <span className="text-green-600">{results.data.admin}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-slate-600">Products Created:</span>
                          <span className="text-blue-600">{results.data.products}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-slate-600">Orders Created:</span>
                          <span className="text-green-600">{results.data.orders}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-slate-600">Complaints Created:</span>
                          <span className="text-purple-600">{results.data.complaints}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="text-amber-900 mb-3">Next Steps</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                        <li>Navigate to the Admin Login page</li>
                        <li>Use the credentials shown above to log in</li>
                        <li>Explore the admin dashboard to manage products, orders, and complaints</li>
                        <li>Test the customer-facing pages with the sample data</li>
                      </ol>
                    </div>

                    <Button 
                      onClick={() => onNavigate('home')}
                      variant="outline"
                      className="w-full"
                    >
                      Go to Application
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>Note: You can run this initialization multiple times. Existing data will be preserved.</p>
        </div>
      </div>
    </div>
  );
}