import CheckoutForm from "@/components/CheckoutForm";
import { useSearchParams } from "react-router";
import { useGetBookingbyIdQuery } from "@/lib/api";
import { useEffect } from "react";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { data: booking, isLoading: isBookingLoading, error } = useGetBookingbyIdQuery(bookingId);

    useEffect(() => {
    console.log('PaymentPage Debug:', {
      bookingId,
      booking,
      isLoading: isBookingLoading,
      error,
      stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing',
      backendUrl: import.meta.env.VITE_BACKEND_URL
    });
  }, [bookingId, booking, isBookingLoading, error]);

  if (isBookingLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Booking Not Found
        </h2>
        <p className="mb-4">
          We couldn't find your booking. Please try again.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-4xl font-bold">Review Your Booking</h2>
      <div className="mt-4">
        <CheckoutForm bookingId={booking._id} />
      </div>
    </main>
  );
}

export default PaymentPage;