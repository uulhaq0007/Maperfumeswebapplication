import { useState, useEffect } from 'react';
import { MessageSquare, Eye } from 'lucide-react@0.487.0';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';

interface Complaint {
  id: string;
  name: string;
  email: string;
  phone?: string;
Failed to save product
  subject?: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

interface ComplaintsTabProps {
  adminToken: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

export function ComplaintsTab({ adminToken }: ComplaintsTabProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/complaints`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ee87e1bb/complaints/${complaintId}`,
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
        toast.success('Status updated!');
        fetchComplaints();
        if (selectedComplaint?.id === complaintId) {
          const data = await response.json();
          setSelectedComplaint(data.complaint);
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Update complaint error:', error);
      toast.error('Failed to update status');
    }
  };

  const viewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
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

  const pendingCount = complaints.filter(c => c.status === 'pending').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl">Customer Messages</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pendingCount > 0 && (
              <span className="text-yellow-600">{pendingCount} pending messages</span>
            )}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total: {complaints.length} messages
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading messages...</div>
      ) : complaints.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Subject</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(complaint => (
                  <tr key={complaint.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="text-sm">{formatDate(complaint.createdAt)}</div>
                    </td>
                    <td className="p-4">{complaint.name}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{complaint.email}</div>
                        {complaint.phone && (
                          <div className="text-xs text-gray-500">{complaint.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs truncate">
                        {complaint.subject || 'No subject'}
                      </div>
                    </td>
                    <td className="p-4">
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                      >
                        <SelectTrigger className={`w-28 ${statusColors[complaint.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewComplaint(complaint)}
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
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No messages yet</p>
        </div>
      )}

      {/* Complaint Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>Message Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Status</div>
                  <Select
                    value={selectedComplaint.status}
                    onValueChange={(value) => handleStatusUpdate(selectedComplaint.id, value)}
                  >
                    <SelectTrigger className={statusColors[selectedComplaint.status]}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedComplaint.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedComplaint.email}</span>
                    </div>
                    {selectedComplaint.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedComplaint.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Received:</span>
                      <span>{formatDate(selectedComplaint.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                {selectedComplaint.subject && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="mb-2 text-sm text-gray-600">Subject</h3>
                    <p>{selectedComplaint.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="mb-2 text-sm text-gray-600">Message</h3>
                  <p className="whitespace-pre-wrap">{selectedComplaint.message}</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedComplaint.email}?subject=Re: ${selectedComplaint.subject || 'Your Message'}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Send Email
                    </a>
                    {selectedComplaint.phone && (
                      <>
                        <span className="text-gray-400">•</span>
                        <a
                          href={`tel:${selectedComplaint.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Call Customer
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}