'use client'
import { useDropzone } from 'react-dropzone-esm';
import Image from 'next/image'
import { toBase64 } from '../utils';
import { usePlaceStore } from "../store";

const ImageLoader = () => {
  const image = usePlaceStore((state) => state.image)
  const setImage = usePlaceStore((state) => state.setImage)

  const onDropImage = async (acceptedFiles: any[]) => {
    const img = await toBase64(acceptedFiles[0])
    setImage(img)
  }

  const { getRootProps, getInputProps } = useDropzone({ maxFiles: 1, multiple: false, maxSize: 4000000, onDrop: onDropImage });
  return (
    <section className="container">
      <h2 className='text-xl mb-2 font-medium drop-shadow-xl shadow-2xl'>Step 1 - Upload an image with a visible background to analize</h2>
      <div className='flex md:flex-row flex-col gap-4'>
        <div {...getRootProps({className: 'w-full bg-transparent px-5 py-3 md:px-10 md:py-6 text-gray-500 border-dotted border-4 border-green-400 h-20 drop-shadow-xl hover:bg-green-900 cursor-pointer'})}>
          <input {...getInputProps()} />
          <p className='drop-shadow-xl text-slate-400 shadow-2xl'>Drag and drop a picture, or click to select files</p>
        </div>
        <Image src={image} alt="" width={200} height={200}/>
      </div>
    </section>
  );
}

export default ImageLoader