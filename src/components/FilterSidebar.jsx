import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

const FilterSidebar = ({
    locations,
    selectedLocation,
    minPrice,
    maxPrice,
    onFilterChange,
    onClearFilters
}) => {
    const [priceRange, setPriceRange] = useState({
        min: minPrice || '',
        max: maxPrice || ''
    });
    const [selectedLocations, setSelectedLocations] = useState(
        selectedLocation ? selectedLocation.split(',') : []
    );
    const [locationSearch, setLocationSearch] = useState('');

    useEffect(() => {
        setPriceRange({ min: minPrice || '', max: maxPrice || '' });
        setSelectedLocations(selectedLocation ? selectedLocation.split(',') : []);
    }, [minPrice, maxPrice, selectedLocation]);

    const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(locationSearch.toLowerCase())
    );

    const handlePriceChange = (type, value) => {
        const newPriceRange = { ...priceRange, [type]: value };
        setPriceRange(newPriceRange);

        // Debounced price update
        const timeoutId = setTimeout(() => {
            onFilterChange({
                minPrice: newPriceRange.min,
                maxPrice: newPriceRange.max
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleLocationToggle = (locationName) => {
        console.log('Location clicked:', locationName);
        
        const newLocations = selectedLocations.includes(locationName)
            ? selectedLocations.filter(name => name !== locationName)
            : [...selectedLocations, locationName];

        console.log('New locations array:', newLocations);
        
        setSelectedLocations(newLocations);
        
        const locationValue = newLocations.length > 0 ? newLocations.join(',') : '';
        console.log('Calling onFilterChange with location:', locationValue);
        
        onFilterChange({
            location: locationValue
        });
    };

    const removeLocation = (locationName) => {
        console.log('Removing location:', locationName);
        
        const newLocations = selectedLocations.filter(name => name !== locationName);
        setSelectedLocations(newLocations);
        
        const locationValue = newLocations.length > 0 ? newLocations.join(',') : '';
        console.log('Calling onFilterChange after removal:', locationValue);
        
        onFilterChange({
            location: locationValue
        });
    };

    const hasActiveFilters = selectedLocations.length > 0 || priceRange.min || priceRange.max;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        Clear All
                    </Button>
                )}
            </div>

            {/* Location Filter */}
            <div>
                <Label htmlFor="location-search" className="block text-sm font-medium mb-2">
                    Location
                </Label>
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        id="location-search"
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Selected Location Chips */}
                {selectedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedLocations.map(locationName => (
                            <Badge key={locationName} variant="secondary" className="flex items-center gap-1">
                                {locationName}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeLocation(locationName)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Location List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredLocations.map(location => (
                        <div key={location._id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`location-${location._id}`}
                                checked={selectedLocations.includes(location.name)}
                                onChange={() => handleLocationToggle(location.name)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor={`location-${location._id}`}
                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                            >
                                {location.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <Label className="block text-sm font-medium mb-2">Price Range ($)</Label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="min-price" className="text-xs text-gray-500">Min</Label>
                        <Input
                            id="min-price"
                            type="number"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="max-price" className="text-xs text-gray-500">Max</Label>
                        <Input
                            id="max-price"
                            type="number"
                            placeholder="1000"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;