'use client'
import Location from './components/Location';
import ImageLoader from './components/ImageLoader';
import { Toaster } from 'sonner';
import { usePlaceStore } from './store';
import Image from 'next/image'
import Results from './components/Results';

export default function Home() {
  const image = usePlaceStore((state) => state.image)

  return (
    <>
    <header>
      <div className="bg-red-900 text-white w-100 h-6 flex items-center justify-center p-1">
        Made with 🫰 by 3d4d35 - <a href="https://github.com/edades/similar-places" target="_blank" rel="noopener noreferrer" className='text-yellow-400 cursor-pointer'>&nbsp;Github</a>
      </div>
    </header>
    {image !== './300.svg' && <Image
      className='-z-10 blur-lg brightness-50'
      src={image}
      fill={true}
      alt={"Background Image"}
    />
    }
    <main className='container mx-auto w-10/12 md:w-8/12 text-zinc-300 py-6'>
      <Toaster richColors position="top-center"/>
      <p className='text-xs text-center'>Vercel Hackathon - WIP - NextJS/Vercel SDK AI/OpenAI/GPlaces API</p>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Similar places AI</h1>
      <ImageLoader />
      <Location />
      <Results />
	  </main>
  </>
  );
}
