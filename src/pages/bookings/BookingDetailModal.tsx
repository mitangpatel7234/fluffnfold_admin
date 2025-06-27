import React from 'react';
import { Booking } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-md w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl">

        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Booking ID</label>
                <p className="text-lg font-semibold">#{booking.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Customer Name</label>
              <p className="text-lg">{booking.user?.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p>{booking.user?.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p>{booking.user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Pickup Date</label>
                <p>{new Date(booking.pickupDate).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery Date</label>
                <p>{new Date(booking.deliveryDate).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p>{booking.fullAddress}, {booking.area} - {booking.pincode}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p>{booking.paymentMethod?.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <p>{booking.paymentStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Paid</label>
                <p>{booking.isPaid ? 'Yes' : 'No'}</p>
              </div>
              
            </div>

            {booking.items?.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Items</label>
                {booking.items.map((item) => (
                  <div key={item.id} className="border p-3 rounded-md bg-gray-50">
                    <p className="font-semibold">{item.product.name} (x{item.quantity})</p>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <p className="text-sm text-green-700 font-medium">${item.product.pricePerKg} / kg</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Total Amount</label>
              <p className="text-xl font-bold text-green-600">${booking.amount}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p>{new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
