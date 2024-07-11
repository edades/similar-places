import { usePlaceStore } from "../store";

const useLocations = () => {
  const location = usePlaceStore((state) => state.location)
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
    }    
    const error = (err: GeolocationPositionError) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      alert('There was an error locating you, pleas try writing an address')
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  console.log('===Coords: ', location)


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