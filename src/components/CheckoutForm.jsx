import {loadStripe} from '@stripe/stripe-js'
import {EmbeddedCheckout,EmbeddedCheckoutProvider} from '@stripe/react-stripe-js'
import {useAuth} from '@clerk/clerk-react'
import { useCallback } from 'react'

const STRIPE_PUBLISHABLE_KEY=import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise=loadStripe(STRIPE_PUBLISHABLE_KEY);
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL

const CheckoutForm=({bookingId})=>{
    const {getToken}=useAuth();

    const fetchClientSecret=useCallback(async()=>{
        const token=await getToken();
        const response=await fetch(`${BACKEND_URL}/payments/create-checkout-session`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`,
            },
            body:JSON.stringify({bookingId}),
        });
        const data=await response.json();
        return data.clientSecret;
    },[bookingId,getToken]);

    
    return(
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise} 
                options={{fetchClientSecret}}
            >
                <EmbeddedCheckout/>
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutForm;