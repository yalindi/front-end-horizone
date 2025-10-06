import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: async (headers) => {
      return new Promise((resolve) => {
        async function checkToken() {
          const clerk=window.Clerk;
          if (clerk) {
            const token = await clerk.session?.getToken();
            headers.set('Authorization', `Bearer ${token}`);
            resolve(headers);
          } else {
            setTimeout(checkToken,500)
          }
        }
        checkToken();
          
      });
   },
  }),
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: () => 'hotels',
     }),
    getHotelsBySearch: build.query({
      query: (search) => `hotels/search?query=${search}`,
      }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
    }),
    getHotels: build.query({
      query: (filters={})=>{
        const{
          page=1,
          limit=12,
          location,
          minPrice,
          maxPrice,
          sortBy='featured',
          search
        }=filters
        const params=new URLSearchParams();

        if(page) params.append('page',page);
        if (limit) params.append('limit', limit);
        if (location) params.append('location', location);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sortBy) params.append('sortBy', sortBy);
        if (search) params.append('search', search);

        return `hotels/filter?${params.toString()}`;
      }
    }),

    getHotelLocations: build.query({
      query:()=>'hotels/locations',

    }),

    createHotel: build.mutation({
      query: (hotel) => ({
        url: 'hotels',
        method: 'POST',
        body: hotel,
      }),
    }),
    createBooking: build.mutation({
      query: (booking) => ({
        url: 'bookings',
        method: 'POST',
        body: booking,
      }),
    }),
    getBookingbyId: build.query({
      query: (bookingId) => `bookings/${bookingId}`,
    }),
    getBookingsbyUserId: build.query({
      query: (userId)=>`bookings/user/${userId}`
    }),
    createCheckoutSession: build.mutation({
      query:(payload) => ({
        url: 'payments/create-checkout-session',
        method: 'POST',
        body: payload,
      }),
    }),
    getCheckoutSessionStatus: build.query({
      query: (sessionId) => `payments/checkout-session?sessionId=${sessionId}`,
    }),    
    addLocation: build.mutation({
      query: (location) => ({
        url: 'locations',
        method: 'POST',
        body: {
          name: location.name,
        },
      }),
    }),
    addReview: build.mutation({
      query: (review) => ({
        url: 'reviews',
        method: 'POST',
        body: review
      }),
    }),

    getAllLocations: build.query({
      query: () => 'locations',
    }),
    
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllHotelsQuery,useGetHotelByIdQuery,useGetHotelsBySearchQuery,useCreateHotelMutation,useAddLocationMutation, useGetAllLocationsQuery,useAddReviewMutation,useCreateBookingMutation,useGetBookingbyIdQuery,useCreateCheckoutSessionMutation,useGetCheckoutSessionStatusQuery,useGetBookingsbyUserIdQuery,useGetHotelLocationsQuery,useGetHotelsQuery} = api