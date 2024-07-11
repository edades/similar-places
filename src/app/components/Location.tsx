'use client'
import Autocomplete from "./Autocomplete";
import {
  APIProvider,
} from "@vis.gl/react-google-maps";
import useLocations from "../hooks/useLocation";

const Location = () => {
  const [getMyLocation, onPlaceSelect] = useLocations()
  return (
    <div>
      <h2 className="text-xl mb-2 font-medium drop-shadow-xl shadow-2xl mt-4">Step 2 - Select a location to search for similar places around</h2>
      <div className="flex md:flex-row flex-col items-end gap-4 justify-between">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <div className="basis-8/12">
            <Autocomplete onSelect={onPlaceSelect} />
          </div>
        </APIProvider>
        <div className="basis-4/12">
          <button onClick={getMyLocation} className="border-2 border-green-400 bg-slate-900 rounded py-2 px-2 hover:bg-green-900">
            Or get your current location
          </button>
        </div>
      </div>
    </div>
  )
}

export default Location