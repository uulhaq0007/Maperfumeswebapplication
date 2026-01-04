import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Page } from '../App';

interface ContactProps {
  onNavigate: (page: Page) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/complaints`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question or complaint? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="03XX XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us how we can help..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <Send className="w-5 h-5 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Phone</h3>
                    <p className="text-gray-600">+92 300 1234567</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Available Mon-Sat, 10 AM - 8 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Email</h3>
                    <p className="text-gray-600">info@maperfumes.pk</p>
                    <p className="text-sm text-gray-500 mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Location</h3>
                    <p className="text-gray-600">Karachi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl mb-6">Common Questions</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-1">How can I track my order?</h3>
                  <p className="text-sm text-gray-600">
                    Use our{' '}
                    <button
                      onClick={() => onNavigate('order-tracking')}
                      className="text-blue-600 hover:underline"
                    >
                      order tracking page
                    </button>{' '}
                    with your order number and phone number.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1">What payment methods do you accept?</h3>
                  <p className="text-sm text-gray-600">
                    We currently accept Cash on Delivery (COD) across Pakistan.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1">How long does delivery take?</h3>
                  <p className="text-sm text-gray-600">
                    Delivery typically takes 3-5 business days across Pakistan.
                  </p>
                </div>

                <div>
                  <h3 className="mb-1">Can I return or exchange a product?</h3>
                  <p className="text-sm text-gray-600">
                    Please contact us with your order details to discuss returns or exchanges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}