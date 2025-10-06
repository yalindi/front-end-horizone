// import {loadStripe} from '@stripe/stripe-js'
// import {EmbeddedCheckout,EmbeddedCheckoutProvider} from '@stripe/react-stripe-js'
// import {useAuth} from '@clerk/clerk-react'
// import { useCallback, useState, useEffect } from 'react'

// const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// // Load Stripe outside component to avoid multiple loads
// const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// const CheckoutForm = ({bookingId}) => {
//     const {getToken} = useAuth();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [clientSecret, setClientSecret] = useState(null);

//     // Add debug logging
//     useEffect(() => {
//         console.log('🔍 [CheckoutForm Debug]:', {
//             BACKEND_URL: BACKEND_URL,
//             includesApi: BACKEND_URL?.includes('/api'),
//             calculatedEndpoint: `${BACKEND_URL}/payments/create-checkout-session`,
//             bookingId: bookingId
//         });
//     }, [bookingId]);

//     const fetchClientSecret = useCallback(async() => {
//         try {
//             if (!bookingId) {
//                 throw new Error('No booking ID provided');
//             }
//             const token = await getToken();
//             const response = await fetch(`${BACKEND_URL}/payments/create-checkout-session`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({bookingId}),
//             });
            
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (!data.clientSecret) {
//                 throw new Error('No client secret received from server');
//             }
            
//             return data.clientSecret;
//         } catch (err) {
//             console.error('Error fetching client secret:', err);
//             setError(err.message);
//             throw err;
//         }
//     }, [bookingId, getToken]);

//     useEffect()

//     return (
//         <div id="checkout" className="w-full">
//             <EmbeddedCheckoutProvider
//                 stripe={stripePromise}
//                 options={{fetchClientSecret: () => Promise.resolve(clientSecret)}}
//             >
//                 <EmbeddedCheckout />
//             </EmbeddedCheckoutProvider>
//         </div>
//     );
// }

// export default CheckoutForm;

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const CheckoutForm = ({ bookingId }) => {
  const { getToken } = useAuth();

  const fetchClientSecret = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(
      `${BACKEND_URL}/api/payments/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      }
    );
    const data = await res.json();
    return data.clientSecret;
  }, [bookingId, getToken]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;

