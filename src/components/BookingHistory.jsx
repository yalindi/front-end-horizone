import { useGetBookingsbyUserIdQuery } from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, CreditCard, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format,isValid,parseISO } from "date-fns";
import {useState} from "react"

export function BookingHistory() {
  const { user } = useUser();
  const { data: bookings, isLoading, error } = useGetBookingsbyUserIdQuery(user?.id);
  const [statusFilter,setStatusFilter]=useState('all')
  const [dateFilter,setDateFilter]=useState('')

  const filterBooking=bookings?.filter((booking)=>{
  const matchState=statusFilter=="all"|| booking.paymentStatus===statusFilter;

  const bookingCheckIn = booking.checkIn ? parseISO(booking.checkIn) : new Date();
  const matchDate=!dateFilter||(isValid(bookingCheckIn)&&format(bookingCheckIn,"yyyy-MM-dd")===dateFilter);
  
  return matchDate && matchState
}) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Booking history error:', error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading booking history</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
        <p className="text-gray-500">Your booking history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Booking History</h2>
      
      <div className="flex gap-2 mb-4">
        <select onChange={(e)=>setStatusFilter(e.target.value)}className="border rounded-md px-3 py-2">
          <option value="all">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>
        <input 
          type="date" 
          onChange={(e)=>setDateFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="Filter by date..."
        />
      </div>

      <div className="space-y-4">
        {filterBooking.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking }) {
  if (!booking.hotelId) {
    return (
      <div className="border rounded-lg p-6 bg-yellow-50">
        <p className="text-yellow-800">Hotel information not available</p>
      </div>
    );
  }

  const hotel = booking.hotelId;
  const checkIn = booking.checkIn ? parseISO(booking.checkIn) : new Date();
  const checkOut = booking.checkOut ? parseISO(booking.checkOut) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const createdAt = booking.createdAt ? parseISO(booking.createdAt) : new Date();
  const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const totalAmount = hotel.price * nights;

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hotel Image */}
        <div className="flex-shrink-0">
          <img
            src={hotel?.image || '/placeholder-hotel.jpg'}
            alt={hotel?.name || 'Hotel'}
            className="w-32 h-24 object-cover rounded-lg"
          />
        </div>
        
        {/* Booking Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{hotel?.name || 'Unknown Hotel'}</h3>
            <Badge 
              variant={booking.paymentStatus === "PAID" ? "default" : "secondary"}
              className={
                booking.paymentStatus === "PAID" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {booking.paymentStatus === "PAID" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {booking.paymentStatus || 'PENDING'}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {hotel?.location || 'Location not available'}
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {isValid(checkIn) ? format(checkIn, "MMM dd, yyyy") : "Invalid date"} - {isValid(checkOut) ? format(checkOut, "MMM dd, yyyy") : "Invalid date"}
              <span className="mx-2">•</span>
              {nights} {nights === 1 ? "night" : "nights"}
            </div>
            
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Room {booking.roomNumber} • ${hotel?.price || 'N/A'}/night
              <span className="mx-2">•</span>
              <strong>Total: ${totalAmount}</strong>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Booked on {isValid(createdAt) ? format(createdAt, "MMM dd, yyyy 'at' h:mm a") : "Date not available"}
          </div>
        </div>
      </div>
    </div>
  );
}