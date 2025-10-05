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

//     const fetchClientSecret = useCallback(async() => {
//         try {
//             if (!bookingId) {
//                 throw new Error('No booking ID provided');
//             }

//             if (!STRIPE_PUBLISHABLE_KEY) {
//                 throw new Error('Stripe publishable key is missing');
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

//     useEffect(() => {
//         let mounted = true;

//         const initializeCheckout = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 if (!stripePromise) {
//                     throw new Error('Stripe failed to initialize');
//                 }

//                 const secret = await fetchClientSecret();
//                 if (mounted) {
//                     setClientSecret(secret);
//                 }
//             } catch (err) {
//                 if (mounted) {
//                     console.error('Checkout initialization failed:', err);
//                 }
//             } finally {
//                 if (mounted) {
//                     setLoading(false);
//                 }
//             }
//         };

//         if (bookingId) {
//             initializeCheckout();
//         }

//         return () => {
//             mounted = false;
//         };
//     }, [fetchClientSecret, bookingId]);

//     if (!STRIPE_PUBLISHABLE_KEY) {
//         return (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                 <p className="text-red-800">Stripe configuration error: Missing publishable key</p>
//             </div>
//         );
//     }

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center p-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//                 <span className="ml-2">Loading checkout...</span>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                 <p className="text-red-800 font-semibold">Payment Error</p>
//                 <p className="text-red-600 mt-1">{error}</p>
//                 <button 
//                     onClick={() => window.location.reload()}
//                     className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//                 >
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     if (!clientSecret) {
//         return (
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//                 <p className="text-yellow-800">Unable to initialize payment. Please try again.</p>
//             </div>
//         );
//     }

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

import {loadStripe} from '@stripe/stripe-js'
import {EmbeddedCheckout,EmbeddedCheckoutProvider} from '@stripe/react-stripe-js'
import {useAuth} from '@clerk/clerk-react'
import { useCallback, useState, useEffect } from 'react'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const CheckoutForm = ({bookingId}) => {
    const {getToken} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    const fetchClientSecret = useCallback(async() => {
        try {
            if (!bookingId) {
                throw new Error('No booking ID provided');
            }

            const token = await getToken();
            
            // Test ALL possible endpoint combinations
            const baseUrl = BACKEND_URL;
            const endpoints = [
                // Current attempt
                `${baseUrl}/payments/create-checkout-session`,
                // Without /api in base URL
                `${baseUrl.replace('/api', '')}/payments/create-checkout-session`,
                `${baseUrl.replace('/api', '')}/api/payments/create-checkout-session`,
                // Different variations
                `${baseUrl}/create-checkout-session`,
                `${baseUrl.replace('/api', '')}/create-checkout-session`,
                // With payment (singular)
                `${baseUrl}/payment/create-checkout-session`,
                `${baseUrl.replace('/api', '')}/payment/create-checkout-session`,
            ];

            let debugLog = '🔍 Testing Payment Endpoints:\n\n';
            let lastError = null;
            let successEndpoint = null;
            
            for (const endpoint of endpoints) {
                try {
                    debugLog += `📡 Testing: ${endpoint}\n`;
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({bookingId}),
                    });
                    
                    debugLog += `   Status: ${response.status}\n`;
                    
                    if (response.ok) {
                        const data = await response.json();
                        debugLog += `   ✅ SUCCESS! Client secret received\n`;
                        successEndpoint = endpoint;
                        setDebugInfo(debugLog);
                        return data.clientSecret;
                    } else {
                        let errorDetails = '';
                        try {
                            const errorData = await response.json();
                            errorDetails = errorData.message || 'No message';
                        } catch {
                            errorDetails = await response.text() || 'No details';
                        }
                        debugLog += `   ❌ Failed: ${errorDetails}\n`;
                        lastError = new Error(`${endpoint}: ${response.status} - ${errorDetails}`);
                    }
                } catch (err) {
                    debugLog += `   ❌ Network Error: ${err.message}\n`;
                    lastError = err;
                }
                debugLog += '\n';
            }
            
            setDebugInfo(debugLog);
            
            if (!successEndpoint) {
                throw lastError || new Error('All endpoint variations failed. Check your backend route configuration.');
            }
            
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
                setDebugInfo('Starting endpoint discovery...');
                
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
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Discovering payment endpoint...</p>
                {debugInfo && (
                    <div className="mt-4 w-full max-w-2xl">
                        <pre className="text-xs bg-gray-100 p-3 rounded max-w-full overflow-auto">
                            {debugInfo}
                        </pre>
                    </div>
                )}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Configuration Error</h3>
                <p className="text-red-600 mb-4">{error}</p>
                
                {debugInfo && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 font-semibold mb-2">Endpoint Test Results:</p>
                        <pre className="text-xs whitespace-pre-wrap max-h-60 overflow-auto">{debugInfo}</pre>
                    </div>
                )}

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-800 text-sm">
                        <strong>Next Steps:</strong> 
                        <br/>1. Check your backend route mounting in index.ts
                        <br/>2. Verify the payment router routes are correct
                        <br/>3. Ensure the backend is deployed with latest changes
                    </p>
                </div>

                <div className="space-y-2">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
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