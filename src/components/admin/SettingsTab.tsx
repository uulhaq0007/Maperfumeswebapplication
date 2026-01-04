import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';

interface SettingsTabProps {
  adminToken: string;
}

interface StoreSettings {
  deliveryCharge: number;
  currency: string;
  deliveryDays: string;
}

export function SettingsTab({ adminToken }: SettingsTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    deliveryCharge: 200,
    currency: 'PKR',
    deliveryDays: '3-5 business days',
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
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setSettings(prev => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl">Store Settings</h2>
        <p className="text-gray-600 mt-1">Manage your store configuration</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="mb-6">Delivery Settings</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="deliveryCharge">Delivery Charge (PKR)</Label>
                <Input
                  id="deliveryCharge"
                  name="deliveryCharge"
                  type="number"
                  value={settings.deliveryCharge}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This amount will be added to all orders
                </p>
              </div>

              <div>
                <Label htmlFor="deliveryDays">Estimated Delivery Time</Label>
                <Input
                  id="deliveryDays"
                  name="deliveryDays"
                  value={settings.deliveryDays}
                  onChange={handleInputChange}
                  placeholder="e.g., 3-5 business days"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed to customers during checkout
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="mb-6">Store Information</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Currency is set to PKR (Pakistani Rupee)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">💡 Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep delivery charges competitive to encourage more orders</li>
              <li>• Update delivery time estimates based on your actual fulfillment speed</li>
              <li>• Remember to save your changes before leaving this page</li>
            </ul>
          </div>

          <Button type="submit" size="lg" disabled={saving}>
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Current Delivery Charge</div>
              <div className="text-lg">PKR {settings.deliveryCharge.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Estimated Delivery</div>
              <div className="text-lg">{settings.deliveryDays}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}