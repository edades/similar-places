'use client'
import { useState, useRef, useEffect } from "react";
import {
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { usePlaceStore } from "../store";

const Autocomplete = ({ onSelect } : { onSelect: (place: google.maps.places.PlaceResult | null) => void }) => {
  const location = usePlaceStore((state) => state.location)
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<any>(null);
  const places = useMapsLibrary("places");

  const hasCurrentLocation  = location.title === 'currentLocation'

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    
    placeAutocomplete.addListener("place_changed", () => {
      onSelect(placeAutocomplete.getPlace());
    });
  }, [onSelect, placeAutocomplete]);

  useEffect(() => {
    if (inputRef.current && hasCurrentLocation) {
      inputRef.current.value = ""
    }
  }, [location.title, hasCurrentLocation])

  return (
    <input ref={inputRef} placeholder={hasCurrentLocation ? 'Using your current location' : 'Enter a place or address'} className="w-full mt-3 mb-0 h-12 px-4 text-black" />
  );
}

export default Autocomplete