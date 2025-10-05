import {loadStripe} from '@stripe/stripe-js'
import {EmbeddedCheckout,EmbeddedCheckoutProvider} from '@stripe/react-stripe-js'
import {useAuth} from '@clerk/clerk-react'
import { useCallback, useState, useEffect } from 'react'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.STRIPE_PUBLISHABLE_KEY
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Load Stripe outside component to avoid multiple loads
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const CheckoutForm = ({bookingId}) => {
    const {getToken} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    const fetchClientSecret = useCallback(async() => {
        try {
            if (!bookingId) {
                throw new Error('No booking ID provided');
            }

            if (!STRIPE_PUBLISHABLE_KEY) {
                throw new Error('Stripe publishable key is missing');
            }

            const token = await getToken();
            const response = await fetch(`${BACKEND_URL}/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({bookingId}),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.clientSecret) {
                throw new Error('No client secret received from server');
            }
            
            return data.clientSecret;
        } catch (err) {
            console.error('Error fetching client secret:', err);
            setError(err.message);
            throw err;
        }
    }, [bookingId, getToken]);

    useEffect(() => {
        let mounted = true;

        const initializeCheckout = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!stripePromise) {
                    throw new Error('Stripe failed to initialize');
                }

                const secret = await fetchClientSecret();
                if (mounted) {
                    setClientSecret(secret);
                }
            } catch (err) {
                if (mounted) {
                    console.error('Checkout initialization failed:', err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (bookingId) {
            initializeCheckout();
        }

        return () => {
            mounted = false;
        };
    }, [fetchClientSecret, bookingId]);

    if (!STRIPE_PUBLISHABLE_KEY) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">Stripe configuration error: Missing publishable key</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-2">Loading checkout...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 font-semibold">Payment Error</p>
                <p className="text-red-600 mt-1">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">Unable to initialize payment. Please try again.</p>
            </div>
        );
    }

    return (
        <div id="checkout" className="w-full">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{fetchClientSecret: () => Promise.resolve(clientSecret)}}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
}

export default CheckoutForm;