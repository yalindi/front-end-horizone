// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router';
// import HotelGrid from '@/components/HotelGrid';
// import HotelList from '@/components/HotelList';
// import FilterSidebar from '@/components/FilterSidebar';
// import SortDropdown from '@/components/SortDropdown';
// import ViewToggle from '@/components/ViewToggle';
// import Pagination from '@/components/Pagination';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
// import { RefreshCw, Hotel, Filter } from 'lucide-react';
// import { useGetHotelsQuery, useGetAllLocationsQuery } from '@/lib/api'; // UPDATED: Changed to useGetHotelLocationsQuery

// const HotelsPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

//   // Get current filters from URL
//   const currentPage = parseInt(searchParams.get('page')) || 1;
//   const location = searchParams.get('location') || '';
//   const minPrice = searchParams.get('minPrice') || '';
//   const maxPrice = searchParams.get('maxPrice') || '';
//   const sortBy = searchParams.get('sortBy') || 'featured';
//   const searchQuery = searchParams.get('search') || '';

//   // Build query object for API
//   const queryParams = {
//     page: currentPage,
//     limit: 12,
//     ...(location && { location }),
//     ...(minPrice && { minPrice: parseInt(minPrice) }),
//     ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
//     ...(sortBy && { sortBy }),
//     ...(searchQuery && { search: searchQuery })
//   };

//   const { data: hotelsData, isLoading, isError, refetch } = useGetHotelsQuery(queryParams);
//   const { data: locationsData } = useGetAllLocationsQuery();

//   const hotels = hotelsData?.hotels || [];
//   const totalPages = hotelsData?.totalPages || 1;
//   const totalHotels = hotelsData?.totalCount || 0;

//   // Update URL when filters change
//   const updateFilters = (newFilters) => {
//     const params = new URLSearchParams(searchParams);
    
//     Object.entries(newFilters).forEach(([key, value]) => {
//       if (value === '' || value === null || value === undefined) {
//         params.delete(key);
//       } else {
//         params.set(key, value);
//       }
//     });
    
//     // Reset to page 1 when filters change
//     if (!newFilters.page) {
//       params.set('page', '1');
//     }
    
//     setSearchParams(params);
//   };

//   const handlePageChange = (page) => {
//     updateFilters({ page: page.toString() });
//   };

//   const handleSortChange = (newSortBy) => {
//     updateFilters({ sortBy: newSortBy });
//   };

//   const handleFilterChange = (newFilters) => {
//     updateFilters(newFilters);
//   };

//   const clearFilters = () => {
//     setSearchParams(new URLSearchParams());
//   };

//   if (isError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load hotels</h2>
//           <p className="text-gray-600 mb-4">There was an error loading the hotel listings.</p>
//           <Button onClick={refetch}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
//             <p className="text-gray-600">
//               {isLoading ? 'Loading...' : `Showing ${totalHotels} hotels`}
//             </p>
//           </div>
          
//           <div className="flex items-center gap-4 mt-4 lg:mt-0">
//             <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
//             <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
//             <Button
//               variant="outline"
//               className="lg:hidden"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//             </Button>
//           </div>
//         </div>

//         <div className="flex gap-8">
//           {/* Sidebar Filters - Desktop */}
//           <div className="hidden lg:block w-80 flex-shrink-0">
//             <FilterSidebar
//               locations={locationsData || []}
//               selectedLocation={location}
//               minPrice={minPrice}
//               maxPrice={maxPrice}
//               onFilterChange={handleFilterChange}
//               onClearFilters={clearFilters}
//             />
//           </div>

//           {/* Mobile Filters Overlay */}
//           {showFilters && (<div className="lg:hidden fixed inset-0 z-50 bg-transparent">
            
//               <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
//                 <FilterSidebar
//                   locations={locationsData || []}
//                   selectedLocation={location}
//                   minPrice={minPrice}
//                   maxPrice={maxPrice}
//                   onFilterChange={(filters) => {
//                     handleFilterChange(filters);
//                     setShowFilters(false);
//                   }}
//                   onClearFilters={() => {
//                     clearFilters();
//                     setShowFilters(false);
//                   }}
//                 />
//                 <Button
//                   className="w-full mt-4"
//                   onClick={() => setShowFilters(false)}
//                 >
//                   Apply Filters
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Main Content */}
//           <div className="flex-1 min-w-0">
//             {/* Loading State */}
//             {isLoading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <HotelCardSkeleton key={index} />
//                 ))}
//               </div>
//             ) : (
//               <>
//                 {/* Hotels Grid/List */}
//                 {viewMode === 'grid' ? (
//                   <HotelGrid hotels={hotels} />
//                 ) : (
//                   <HotelList hotels={hotels} />
//                 )}

//                 {/* Empty State */}
//                 {hotels.length === 0 && (
//                   <div className="text-center py-12">
//                     <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
//                     <p className="text-gray-600 mb-4">
//                       Try adjusting your filters or search criteria
//                     </p>
//                     <Button onClick={clearFilters}>
//                       Clear All Filters
//                     </Button>
//                   </div>
//                 )}

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="mt-8">
//                     <Pagination
//                       currentPage={currentPage}
//                       totalPages={totalPages}
//                       onPageChange={handlePageChange}
//                     />
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const HotelCardSkeleton = () => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <Skeleton className="h-48 w-full" />
//     <div className="p-4">
//       <Skeleton className="h-6 w-3/4 mb-2" />
//       <Skeleton className="h-4 w-1/2 mb-2" />
//       <Skeleton className="h-4 w-1/3 mb-4" />
//       <div className="flex justify-between items-center">
//         <Skeleton className="h-6 w-20" />
//         <Skeleton className="h-4 w-16" />
//       </div>
//     </div>
//   </div>
// );

// export default HotelsPage;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import HotelGrid from '@/components/HotelGrid';
import HotelList from '@/components/HotelList';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import ViewToggle from '@/components/ViewToggle';
import Pagination from '@/components/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Hotel, Filter, X } from 'lucide-react';
import { useGetHotelsQuery, useGetAllLocationsQuery } from '@/lib/api';

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Get current filters from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const location = searchParams.get('location') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  // Build query object for API
  const queryParams = {
    page: currentPage,
    limit: 12,
    ...(location && { location }),
    ...(minPrice && { minPrice: parseInt(minPrice) }),
    ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
    ...(sortBy && { sortBy }),
    ...(searchQuery && { search: searchQuery })
  };

  const { data: hotelsData, isLoading, isError, refetch } = useGetHotelsQuery(queryParams);
  const { data: locationsData } = useGetAllLocationsQuery();

  const hotels = hotelsData?.hotels || [];
  const totalPages = hotelsData?.totalPages || 1;
  const totalHotels = hotelsData?.totalCount || 0;

  // Update URL when filters change
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    if (!newFilters.page) {
      params.set('page', '1');
    }
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    updateFilters({ page: page.toString() });
  };

  const handleSortChange = (newSortBy) => {
    updateFilters({ sortBy: newSortBy });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load hotels</h2>
          <p className="text-gray-600 mb-4">There was an error loading the hotel listings.</p>
          <Button onClick={refetch} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header - Improved mobile layout */}
        <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {isLoading ? 'Loading...' : `Showing ${totalHotels} hotels`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Mobile filter button - full width on mobile */}
            <Button
              variant="outline"
              className="sm:hidden w-full justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(location || minPrice || maxPrice) && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              locations={locationsData || []}
              selectedLocation={location}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-4 sm:p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterSidebar
                  locations={locationsData || []}
                  selectedLocation={location}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onFilterChange={(filters) => {
                    handleFilterChange(filters);
                    setShowFilters(false);
                  }}
                  onClearFilters={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Main Content - Improved mobile layout */}
          <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex item overflow */}
            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <HotelCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {/* Hotels Grid/List */}
                {viewMode === 'grid' ? (
                  <HotelGrid hotels={hotels} />
                ) : (
                  <HotelList hotels={hotels} />
                )}

                {/* Empty State */}
                {hotels.length === 0 && (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <Hotel className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button onClick={clearFilters} className="w-full sm:w-auto">
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 px-2">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton component for loading state
const HotelCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-40 sm:h-48 w-full" />
    <div className="p-3 sm:p-4">
      <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-3 sm:mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
        <Skeleton className="h-4 w-12 sm:w-16" />
      </div>
    </div>
  </div>
);

export default HotelsPage;