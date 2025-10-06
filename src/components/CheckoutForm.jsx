import {loadStripe} from '@stripe/stripe-js'
import {EmbeddedCheckout,EmbeddedCheckoutProvider} from '@stripe/react-stripe-js'
import {useAuth} from '@clerk/clerk-react'
import { useCallback, useState, useEffect } from 'react'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({bookingId}) => {
    const {getToken} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    const fetchClientSecret = useCallback(async() => {
        try {
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
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.clientSecret;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [bookingId, getToken]);

    useEffect(() => {
        let mounted = true;

        const initializeCheckout = async () => {
            try {
                const secret = await fetchClientSecret();
                if (mounted) {
                    setClientSecret(secret);
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message);
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
