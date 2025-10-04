
import Hero from '../components/Hero.jsx'
import HotelListings from '../components/HotelListings.jsx'
import HotelsView from '../components/HotelsView.jsx'

function HomePage() {

  return (
    <>
      
      <main>
        <div className="relative min-h-{85vh}">
          <Hero />

        </div>
        <HotelsView/>
        
      </main>
      

    </>
  )
}

export default HomePage
