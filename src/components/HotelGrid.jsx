import HotelCard from '@/components/HotelCard';

const HotelGrid = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {hotels.map(hotel => (
        <HotelCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelGrid;