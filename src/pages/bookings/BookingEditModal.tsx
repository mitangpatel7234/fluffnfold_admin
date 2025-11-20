import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Booking } from '@/types';
import { useApiService } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  
  reloadBookings?: () => void;
}

const BookingEditModal: React.FC<BookingEditModalProps> = ({ isOpen, onClose, booking,reloadBookings }) => {
  const { bookingApi } = useApiService();
  const [form, setForm] = useState({  status: '', isPaid: false });

  useEffect(() => {
    if (booking) {
      setForm({
        status: booking.status,
        isPaid: booking.isPaid || false
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking?.id) return;

    try {
      await bookingApi.updateStatus(booking.id, {
        status: form.status as 'pending' | 'confirmed' | 'pickuped' | 'delivered',
        isPaid: form.isPaid,
      });
      toast({ title: 'Success', description: 'Booking updated successfully.' });
      onClose();
      
      reloadBookings();
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast({ title: 'Error', description: 'Failed to update booking.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Booking #{booking?.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked up">Picked up</option>
            <option value="delivered">Delivered</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isPaid}
              onChange={(e) => setForm((prev) => ({ ...prev, isPaid: e.target.checked }))}
            />
            <span>Is Paid</span>
          </label>

          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingEditModal;
