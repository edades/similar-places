'use client'
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
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

  const userLocation = `${location.lat}, ${location.lng}`

  const callToOpenAI = async () => {
    const resultData = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        bgItems: z.array(z.string()).describe('contiene una lista con los nombres de los items encontrados en el fondo de la imagen analizada que representen el fondo, para luego poder encontrar esos items en otras imagenes, intenta ser especifico.'),
        nearbyPlaces: z.array(z.object({
          name: z.string().describe('nombre del lugar'),
          description: z.string().describe('descripcion breve del lugar'),
        })).describe(`contiene una lista de 3 lugares mas cercanos a ${userLocation} que mas coincidan exactamente con los items encontrados en el fondo de la imagen, no importa la distancia, pero muestrame 3 lugares mas cercanos a ${userLocation} aunque esten ubicados en otro estado, ciudad o pais.`),
        similarPlaces: z.array(z.string()).describe('lista de 3 nombres de lugares cercanos que tengan algunos de los items encontrados en el fondo de la imagen analizada.'),
        hasNearbyPlaces: z.boolean().describe(`es un booleano que dice si cerca de ${userLocation} hay lugares que cumplan que coincidan completamente con los elementos del fondo de la imagen, por favor intenta ser estricto`)
      }),
      mode: 'json',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analiza la imagen, especialmente el fondo para encontrar los elementos principales para luego utilizarlos para encontrar lugares similares' },
            {
              type: 'image',
              image: image,
            },
          ],
        },
      ],
    });
    console.log('resultData: ', resultData)
    setResults(resultData.object)
  }

  console.log('results from open AI: ', results)

  const GoogleMapsLink = ({ name } : { name: string }) => {
    console.log('name: ', name)
    const newName = name.replaceAll(' ', '+')
    console.log('newName: ', newName)
    return <a className='text-teal-400 underline-offset-auto' href={`https://www.google.com/maps/search/?api=1&query=${newName}`} target='_blank'>{name}:</a>
  }

  const ResultsContent = () => {
    if (results) {
      const NearbyPlaces = () => {
        if (results.hasNearbyPlaces) {
          return (
            <p><b>Lugares cercanos, similares al fondo de la imagen:</b> {results.nearbyPlaces.map((item: any) => (
              <div key={item.name}><p>- <GoogleMapsLink name={item.name} /> <i>{item.description}</i></p><br /></div>
            ))}</p>
          )
        }
        return  (
          <p><b>Lugares NO MUY CERCANOS, similares al fondo de la imagen:</b> {results.nearbyPlaces.map((item: any) => (
            <div key={item.name}><p>- <GoogleMapsLink name={item.name} /> <i>{item.description}</i></p><br /></div>
          ))}</p>
        )
      }
      const SimilarPlaces = () => {
        if (!results.hasNearbyPlaces) {
          return (
            <p><b>Otros lugares que no son iguales, pero ten podrian interesar:</b> <br />{results.similarPlaces.map((item: string) => <div key={item}>- {item}<br /></div>)}</p>
          )
        }
        return null
      }
      return (
        <div className='border border-yellow-300 mr-6 p-4'>
          <p><b>Encontramos los siguientes elementos:</b> {results.bgItems.map((item: string) => <div key={item}>- {item}<br /></div>)}</p>
          <br /><br />
          <NearbyPlaces />
          <br /><br />
          <SimilarPlaces />
        </div>
      )
    }
    return null
  }
  return (
    <>
      <div className="w-full p-4 flex justify-center items-center border-t-2 border-green-300 mt-6">
        <button className="px-4 py-2 bg-teal-500 text-slate-900 text-lg font-medium hover:bg-teal-600" onClick={callToOpenAI}>Analize with AI</button>
      </div>
      <ResultsContent />
    </>
  )
}

export default Results