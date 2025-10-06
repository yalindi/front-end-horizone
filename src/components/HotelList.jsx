import { Link } from 'react-router';
import { MapPin, Star, Wifi, Coffee, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HotelList = ({ hotels }) => {
  return (
    <div className="space-y-4">
      {hotels.map(hotel => (
        <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 h-48 md:h-auto">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    <Link to={`/hotels/${hotel._id}`} className="hover:text-primary">
                      {hotel.name}
                    </Link>
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${hotel.price}</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({hotel.reviews?.length || 0})</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {hotel.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Wifi className="h-4 w-4" />
                    <Coffee className="h-4 w-4" />
                    <Car className="h-4 w-4" />
                    <span>+{hotel.amenities?.length || 3} more</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to={`/hotels/${hotel._id}`}>View Details</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/hotels/${hotel._id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelList;