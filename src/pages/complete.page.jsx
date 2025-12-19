import { Button } from "@/components/ui/button";
import { useGetCheckoutSessionStatusQuery } from "@/lib/api";
import { Link, useSearchParams, Navigate } from "react-router";
import { format, isValid, parseISO } from "date-fns";
import { useEffect } from "react";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    localStorage.removeItem("payment_error");
    sessionStorage.removeItem("payment_error");
    if (window.location.search.includes('error=')) {
      const cleanUrl = window.location.pathname + '?session_id=' + sessionId;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [sessionId]);

  const { data, isLoading, isError, refetch } = useGetCheckoutSessionStatusQuery(sessionId);

  const handleRetry = () => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    console.log('Payment error - sessionId:', sessionId);
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Payment Verification Issue</h2>
        <p className="mb-4">
          We're having trouble verifying your payment. This could be a temporary issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button onClick={handleRetry} className="mb-2 sm:mb-0">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Return Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href="mailto:support@hotelbooking.com">Contact Support</a>
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Your payment may have been successful. Check your email for confirmation.
        </p>
      </div>
    );
  }

  if (data?.status === "open") {
    return <Navigate to={`/booking/payment?bookingId=${data?.bookingId}`} />;
  }

  if (data?.status === "complete" || data?.status === "paid") {
    // Clear errors on successful payment
    useEffect(() => {
      localStorage.removeItem("payment_error");
      sessionStorage.removeItem("payment_error");
    }, []);

    const checkInDate = data.booking?.checkIn ? parseISO(data.booking.checkIn) : new Date();
    const checkOutDate = data.booking?.checkOut ? parseISO(data.booking.checkOut) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const formattedCheckIn = isValid(checkInDate) ? format(checkInDate, "MMM dd, yyyy") : "Invalid date";
    const formattedCheckOut = isValid(checkOutDate) ? format(checkOutDate, "MMM dd, yyyy") : "Invalid date";

    const nights = isValid(checkInDate) && isValid(checkOutDate)
      ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    return (
      <section
        id="success"
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md my-8"
      >
        <div className="flex justify-center mb-4 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Booking Confirmed!
        </h2>
        <p className="text-center mb-4">
          Your payment has been processed successfully.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">Payment successful! Confirmation email sent.</span>
          </div>
        </div>

        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="relative h-48">
            {data.hotel?.image && ( 
              <img
                src={data.hotel.image}
                alt={data.hotel?.name || 'Hotel'} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-4 bg-gray-50">
            <h3 className="text-xl font-bold">{data.hotel?.name || 'Hotel'}</h3>
            <p className="text-gray-600 mb-2">{data.hotel?.location || 'Location not available'}</p> 
            {data.hotel?.rating && ( 
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{data.hotel.rating}</span>
                {data.hotel.reviews && (
                  <span className="text-gray-500 text-sm ml-1">
                    ({data.hotel.reviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Booking Details:</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Booking ID</p>
                <p className="font-medium">{data.booking?._id || data.bookingId || 'N/A'}</p> 
              </div>
              <div>
                <p className="text-gray-600 text-sm">Room Number</p>
                <p className="font-medium">{data.booking?.roomNumber || 'N/A'}</p> 
              </div>
              <div>
                <p className="text-gray-600 text-sm">Check-in Date</p>
                <p className="font-medium">{formattedCheckIn}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Check-out Date</p>
                <p className="font-medium">{formattedCheckOut}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Duration</p>
                <p className="font-medium">
                  {nights} {nights === 1 ? "night" : "nights"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Price</p>
                <p className="font-medium">${data.hotel?.price || 'N/A'} per night</p> 
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment Method</p>
                <p className="font-medium capitalize">
                  {data.booking?.paymentMethod 
                    ? data.booking.paymentMethod.replace("_", " ").toLowerCase()
                    : "card"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment Status</p>
                <p className="font-medium text-green-600">
                  PAID
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            If you have any questions, please contact
            <a href="mailto:bookings@example.com" className="text-blue-600 hover:underline">
              {" "}bookings@example.com
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Payment Status Unknown</h2>
      <p className="mb-4">
        We couldn't determine the status of your payment. If you completed a
        booking, please check your email for confirmation.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
        <Button onClick={handleRetry} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default CompletePage;