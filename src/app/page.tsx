'use client'
import Location from './components/Location';
import ImageLoader from './components/ImageLoader';
import { usePlaceStore } from './store';
import Image from 'next/image'
import Results from './components/Results';

export default function Home() {
  const image = usePlaceStore((state) => state.image)

  return (
    <>
    {image !== './300.svg' && <Image
      className='-z-10 blur-lg brightness-50'
      src={image}
      fill={true}
      alt={"Background Image"}
    />
    }
    <main className='container mx-auto w-9/12 text-zinc-300 py-6'>
      <h1 className="text-5xl font-bold text-center mb-6 drop-shadow-xl">Similar places AI</h1>
      <ImageLoader />
      <Location />
      <Results />
	  </main>
  </>
  );
}
