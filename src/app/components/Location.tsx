'use client'
import Autocomplete from "./Autocomplete";
import {
  APIProvider,
} from "@vis.gl/react-google-maps";
import { MapPinArea } from "@phosphor-icons/react";
import useLocations from "../hooks/useLocation";

const Location = () => {
  const [getMyLocation, onPlaceSelect] = useLocations()
  return (
    <div>
      <h2 className="text-xl mb-2 font-medium mt-4">2- Select a location</h2>
      <div className="flex flex-row items-end gap-2 justify-between">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <div className="basis-11/12">
            <Autocomplete onSelect={onPlaceSelect} />
          </div>
        </APIProvider>
        <div className="basis-1/12 flex justify-end">
          <button onClick={getMyLocation} className="border-2 border-green-400 bg-slate-900 rounded py-2 px-2 hover:bg-green-900">
            <MapPinArea size={32} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Location