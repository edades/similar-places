'use client'
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { RocketLaunch, Spinner } from "@phosphor-icons/react";
import { z } from 'zod';
import { usePlaceStore } from "../store"
import { useState } from 'react';

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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
    const resultData = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        bgItems: z.array(z.string()).describe('contiene una lista con los nombres de los items encontrados en el fondo de la imagen analizada que representen el fondo, para luego poder encontrar esos items en otras imagenes, intenta ser especifico.'),
        nearbyPlaces: z.array(z.object({
          name: z.string().describe('nombre del lugar'),
          description: z.string().describe('descripcion breve del lugar'),
        })).describe(`contiene una lista de 3 lugares mas cercanos a ${userLocation} que mas coincidan exactamente con los items encontrados en el fondo de la imagen, no importa la distancia, pero muestrame 3 lugares mas cercanos a ${userLocation} aunque esten ubicados en otro estado, ciudad o pais.`),
        similarPlaces: z.array(z.string()).describe('lista de 3 nombres de lugares cercanos que tengan algunos de los items encontrados en el fondo de la imagen analizada.'),
        hasNearbyPlaces: z.boolean().describe(`es un booleano que dice si cerca de ${userLocation} hay lugares que cumplan que coincidan completamente con los elementos del fondo de la imagen, por favor intenta ser estricto`),
        tips: z.object({
          date: z.string().describe('contiene una recomendación breve de cual es la mejor fecha o epoca para visitar este tipo de lugares'),
          toDo: z.array(z.string()).describe('contiene una lista de string con nombre de actividades recomendadas para hacer en este tipo de lugares'),
          recomendations: z.array(z.string()).describe('contiene una lista de recomendaciones para llevar para ese tipo de lugares, considerando ropa, clima, caminos, etc')
        })
      }),
      mode: 'json',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analiza la imagen, especialmente el fondo para encontrar los elementos principales para luego utilizarlos para encontrar lugares similares, dame los resultados en ingles' },
            {
              type: 'image',
              image: image,
            },
          ],
        },
      ],
    });
    setResults(resultData.object)
    setLoading(false)
    setTimeout(() => {
      document.getElementById('resultsBox')?.scrollIntoView()
    }, 0);
  }

  console.log('results from open AI: ', results)

  const GoogleMapsLink = ({ name } : { name: string }) => {
    const newName = name.replaceAll(' ', '+')
    return <a className='text-green-400 underline-offset-auto' href={`https://www.google.com/maps/search/?api=1&query=${newName}`} target='_blank'>{name}:</a>
  }

  const ResultsContent = () => {
    if (results) {
      const NearbyPlaces = () => {
        if (results.hasNearbyPlaces) {
          return (
            <p><b>Nearby places, similar to the picture background:</b> <br /> {results.nearbyPlaces.map((item: any) => (
              <div key={item.name}><p>- <GoogleMapsLink name={item.name} /> <i>{item.description}</i></p><br /></div>
            ))}</p>
          )
        }
        return  (
          <p><b>Not too nearby places, similar to the picture background:</b> <br /> {results.nearbyPlaces.map((item: any) => (
            <div key={item.name}><p>- <GoogleMapsLink name={item.name} /> <i>{item.description}</i></p><br /></div>
          ))}</p>
        )
      }
      const SimilarPlaces = () => {
        if (!results.hasNearbyPlaces) {
          return (
            <p><b>Other places that might interest you:</b> <br />{results.similarPlaces.map((item: string) => <div key={item}>- {item}<br /></div>)}</p>
          )
        }
        return null
      }

      const ThingsToDo = () => {
        return (
          <div>
            <p><b>Best season to visit:</b> {results.tips.date}</p>
            <br />
            <p><b>Things to do:</b> </p>
            <ul>
              {results.tips.toDo.map((item: string) => <p key={item}> - {item}</p>)}
            </ul>
            <br />
            <p><b>Recomendations: </b></p>
            <ul>
              {results.tips.recomendations.map((item: string) => <p key={item}> - {item}</p>)}
            </ul>
          </div>
        )
      }

      return (
        <div className='border border-yellow-300 p-4'>
          <h3 className='text-center font-medium text-2xl text-green-400 mb-2'>The Results</h3>
          {/* <p><b>Encontramos los siguientes elementos:</b> {results.bgItems.map((item: string) => <div key={item}>- {item}<br /></div>)}</p> */}
          {/* <br /><br /> */}
          <NearbyPlaces />
          <br />
          <SimilarPlaces />
          <br />
          <ThingsToDo />
        </div>
      )
    }
    return null
  }
  return (
    <>
      <div className="w-full p-4 flex justify-center items-center border-t-2 border-green-400 mt-6" id='resultsBox'>
        <button disabled={!hasRequiredData || isLoading} className="disabled:opacity-75 disabled:cursor-not-allowed border-2 enabled:border-green-400 bg-slate-900 rounded py-2 px-2 enabled:hover:bg-green-900 flex gap-1 text-base text-white justify-center items-center" onClick={callToOpenAI}>
          Analize with AI
          <RocketLaunch size={32} color='white'/>
        </button>
      </div>
      {isLoading ? <div className='w-100 flex justify-center items-center'>Getting results from AI <Spinner className='animate-spin' size={32} /></div> : <ResultsContent />}
    </>
  )
}

export default Results