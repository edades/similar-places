import { usePlaceStore } from "../store";
import { toast } from 'sonner';

const useLocations = () => {
  const setLocation = usePlaceStore((state) => state.setLocation)

  const getMyLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    
    const success = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setLocation({
        title: 'currentLocation',
        lat: latitude,
        lng: longitude
      })
      toast.success('Using your current location')
    }    
    const error = (err: GeolocationPositionError) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      toast.error('There was an error locating you, please try writing an address')
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  const onPlaceSelect: (selectedPlace: google.maps.places.PlaceResult | null) => void =
    (selectedPlace: google.maps.places.PlaceResult | null) => {
    if (selectedPlace) {
      setLocation({
        title: selectedPlace.formatted_address || selectedPlace.name,
        lat: selectedPlace?.geometry?.location?.lat(),
        lng: selectedPlace?.geometry?.location?.lng()
      })
    }
  }

  return [getMyLocation, onPlaceSelect] as const
}

export default useLocations