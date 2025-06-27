// import React from 'react';
// import { Customer } from '@/types';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle 
// } from '@/components/ui/dialog';
// import { Card, CardContent } from '@/components/ui/card';

// interface CustomerDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   customer: Customer | null;
// }

// const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
//   isOpen,
//   onClose,
//   customer
// }) => {
//   if (!customer) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Customer Details</DialogTitle>
//         </DialogHeader>
        
//         <Card>
//           <CardContent className="p-6 space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-500">Customer ID</label>
//               <p className="text-lg font-semibold">#{customer.id}</p>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-500">Name</label>
//               <p className="text-lg">{customer.name}</p>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-500">Email</label>
//               <p className="text-lg">{customer.email}</p>
//             </div>

//             {customer.phone && (
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Phone</label>
//                 <p>{customer.phone}</p>
//               </div>
//             )}

//             {customer.address && (
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Address</label>
//                 <p>{customer.address}</p>
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Total Orders</label>
//                 <p className="text-lg font-bold">{customer.totalOrders || 0}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Total Spent</label>
//                 <p className="text-lg font-bold text-green-600">${customer.totalSpent || 0}</p>
//               </div>
//             </div>

//             {customer.createdAt && (
//               <div>
//                 <label className="text-sm font-medium text-gray-500">Joined Date</label>
//                 <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
//               </div>
//             )}

//             <div>
//               <label className="text-sm font-medium text-gray-500">Status</label>
//               <p className={`text-lg ${customer.status ? 'text-green-600' : 'text-red-600'}`}>
//                 {customer.status ? 'Active' : 'Inactive'}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomerDetailModal;




import React from 'react';
import { Customer } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl overflow-y-auto max-h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Customer Details</DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Customer ID</label>
                <p className="text-base font-semibold break-words">#{customer.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="text-base">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-base">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-base">{customer.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">User Type</label>
                <p className="capitalize text-base">{customer.userType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <p className={`text-base font-semibold ${customer.status ? 'text-green-600' : 'text-red-600'}`}>
                  {customer.status ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Total Orders</label>
                <p className="text-base font-bold">{customer.totalOrders || 0}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Total Spent</label>
                <p className="text-base font-bold text-green-600">${customer.totalSpent || 0}</p>
              </div>
              {customer.createdAt && (
                <div>
                  <label className="text-sm text-gray-500">Joined Date</label>
                  <p className="text-base">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Latest Bookings */}
            {customer.latestBookings && customer.latestBookings.length > 0 && (
              <div className="pt-6 border-t mt-4">
                <h3 className="text-lg font-semibold mb-4">Latest Bookings</h3>
                <div className="grid gap-4">
                  {customer.latestBookings.slice(0, 5).map((booking, index) => (
                    <div
                      key={booking.id}
                      className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3"
                    >
                      <div className="text-sm font-medium text-gray-600">#{booking.id}</div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Pickup:</span>{' '}
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-500">Delivery:</span>{' '}
                          {new Date(booking.deliveryDate).toLocaleDateString()}
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-500">Address:</span> {booking.fullAddress}
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>{' '}
                          <span className="text-green-600 font-semibold">${booking.amount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>{' '}
                          <span className="capitalize text-blue-600">{booking.status}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Paid:</span>{' '}
                          <span className={booking.isPaid ? 'text-green-600' : 'text-red-600'}>
                            {booking.isPaid ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment:</span>{' '}
                          <span className="capitalize">{booking.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Payment Status:</span>{' '}
                          <span className="capitalize">{booking.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
