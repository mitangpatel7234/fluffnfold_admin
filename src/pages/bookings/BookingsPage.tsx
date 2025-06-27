



import React, { useState, useEffect } from 'react';
import { useApiService } from '@/services/api';
import { Booking } from '@/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import BookingDetailModal from './BookingDetailModal';
import BookingEditModal from './BookingEditModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const BookingsPage = () => {
  const { bookingApi } = useApiService();
  const [bookings, setBookings] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<any>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadBookings = async (page = 1) => {
    try {
      setLoading(true);
      const response = await bookingApi.getAll(page, 10);
      setBookings(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };
  const handleEditBooking = (booking: Booking) => {
    setSelectedBookingForEdit(booking); // Set the selected booking for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'picked up':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by customer name or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Pickup Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{booking.id}</td>
                    <td className="py-3 px-4">{booking.user?.name}</td>
                    <td className="py-3 px-4">{new Date(booking.pickupDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">₹{parseFloat(booking.amount).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
      variant="outline"
      size="sm"
      onClick={() => handleEditBooking(booking)}
    >
      Edit
    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">#{booking.id}</h3>
                      <p className="text-sm text-gray-600">{booking.user?.name}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{parseFloat(booking.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className='flex flex-row'>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
  variant="outline"
  size="sm"
  onClick={() => handleEditBooking(booking)}
  className="w-full"
>
  Edit
</Button>
</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && loadBookings(currentPage - 1)}
                      className={
                        currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => loadBookings(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && loadBookings(currentPage + 1)}
                      className={
                        currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />\
      <BookingEditModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  booking={selectedBookingForEdit}
  reloadBookings={loadBookings} // Optional: Refresh bookings after editing
/>
    </div>
  );
};

export default BookingsPage;

