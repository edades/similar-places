import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  if(file) {
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  }
});

const callToGenerateObject = (userLocation, image) => generateObject({
  model: openai('gpt-4o'),
  schema: z.object({
    bgItems: z.array(z.string()).describe('contiene una lista con los nombres de los items encontrados en el fondo de la imagen analizada que representen el fondo, para luego poder encontrar esos items en otras imagenes, intenta ser especifico.'),
    nearbyPlaces: z.array(z.object({
      name: z.string().describe('nombre del lugar'),
      description: z.string().describe('descripcion breve del lugar'),
    })).describe(`contiene una lista de 3 lugares mas cercanos a ${userLocation} que mas coincidan exactamente con los items encontrados en el fondo de la imagen, no importa la distancia, pero muestrame 3 lugares mas cercanos a ${userLocation} aunque esten ubicados en otro estado, ciudad o pais.`),
    similarPlaces: z.array(z.string()).describe('lista de 3 nombres de lugares cercanos que tengan algunos de los items encontrados en el fondo de la imagen analizada.'),
    hasNearbyPlaces: z.boolean().describe(`es un booleano que dice si cerca (no mas de 200 millas de distancia) de ${userLocation} hay lugares que cumplan que coincidan completamente con los elementos del fondo de la imagen, por favor intenta ser estricto`),
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
})

export { toBase64, callToGenerateObject }