import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './pages/home.page.jsx'
import SignInPage from './pages/sign-in.page.jsx'
import SignUpPage from './pages/sign-up.page.jsx'
import RootLayout from './components/layouts/root-layout.page.jsx'
import NotFoundPage from './pages/not-found.page.jsx'
import HotelsPage from './pages/hotels.page.jsx'
import HotelDetailsPage from './pages/hotel-details.page.jsx'
import MyAccountPage from './pages/my-account.jsx'

import {BrowserRouter,Routes,Route } from 'react-router'
import { store } from './lib/store'
import { Provider } from 'react-redux'
import CreateHotelPage from './pages/admin/create-hotel.page.jsx'

import { ClerkProvider} from '@clerk/clerk-react'

import ProtectLayout from './components/layouts/protect.layout' 
import AdminProtectLayout from './components/layouts/admin-protect.layout.jsx'

const clerkPublishableKey= import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!clerkPublishableKey){
  throw new Error('Missing Clerk Publishable Key')
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ClerkProvider publishableKey={clerkPublishableKey}>
  <Provider store={store}>
  <BrowserRouter>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route element={<ProtectLayout/>}>
          <Route path="/hotels/:_id" element={<HotelDetailsPage />} />
          <Route path="/account" element={<MyAccountPage />} />
          <Route element={<AdminProtectLayout/>}>
            <Route path="/admin/create-hotel" element={<CreateHotelPage/>}/>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage/>} />

    </Routes>

  </BrowserRouter>
  </Provider>
  </ClerkProvider>
  </StrictMode>
)
