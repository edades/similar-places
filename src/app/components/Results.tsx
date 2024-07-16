'use client'
import { RocketLaunch, Spinner } from "@phosphor-icons/react";
import { usePlaceStore } from "../store"
import { useState } from 'react';
import { callToGenerateObject } from '../utils';
import ResultsContent from "./ResultsContent";

const Results = () => {
  const [results, setResults] = useState<any>(null)

  const image = usePlaceStore((state) => state.image)
  const location = usePlaceStore((state) => state.location)
  const isLoading = usePlaceStore((state) => state.isLoading)
  const setLoading = usePlaceStore((state) => state.setLoading)

  const userLocation = `${location.lat}, ${location.lng}`

  const hasRequiredData = location.title !== 'nolocation' && image !== './300.svg'

  const callToOpenAI = async () => {
    setLoading(true)
    const resultData = await callToGenerateObject(userLocation, image);
    setResults(resultData.object)
    setLoading(false)
    setTimeout(() => {
      document.getElementById('resultsBox')?.scrollIntoView()
    }, 0);
  }
  
  return (
    <>
      <div className="w-full p-4 flex justify-center items-center border-t-2 border-green-400 mt-6" id='resultsBox'>
        <button
          disabled={!hasRequiredData || isLoading}
          className="disabled:opacity-75 disabled:cursor-not-allowed border-2 enabled:border-green-400 bg-slate-900 rounded py-2 px-2 enabled:hover:bg-green-900 flex gap-1 text-base text-white justify-center items-center"
          onClick={callToOpenAI}
        >
          Analize with AI
          <RocketLaunch size={32} color='white'/>
        </button>
      </div>
      {isLoading ? (
        <div className='w-100 flex justify-center items-center -top-52 bg-green-950 bg-opacity-95 text-white h-52 relative text-xl'>
          Getting results from AI <Spinner className='animate-spin' size={32} />
        </div>
      ) : <ResultsContent results={results} />}
    </>
  )
}

export default Results