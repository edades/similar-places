'use client'
import { FileRejection, useDropzone } from 'react-dropzone-esm';
import { UploadSimple } from "@phosphor-icons/react";
import Image from 'next/image'
import { toBase64 } from '../utils';
import { usePlaceStore } from "../store";
import { toast } from 'sonner';

const ImageLoader = () => {
  const image = usePlaceStore((state) => state.image)
  const setImage = usePlaceStore((state) => state.setImage)

  const onDropImage = async (acceptedFiles: any[]) => {
    const img = await toBase64(acceptedFiles[0])
    setImage(img)
  }

  const onRejectedImage = (files: FileRejection[]) => {
    const { errors } = files[0]
    const error = errors[0]
    if (error.code === 'file-too-large') {
      toast.error('File too large - Max 4 Mb')
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ maxFiles: 1, multiple: false, maxSize: 4000000, onDrop: onDropImage, onDropRejected: onRejectedImage, accept: {
    'image/jpeg': [],
    'image/png': []
  } });
  return (
    <section className="container">
      <div className='flex items-center gap-4 mb-4'>
      <h2 className='text-xl mb-2 font-medium'>1- Upload an image</h2>
        <div {...getRootProps({ className: 'border-2 border-green-400 bg-slate-900 rounded py-2 px-2 hover:bg-green-900 bg-transparent px-1 py-1 text-gray-500 hover:bg-green-900 cursor-pointer flex flex-col items-center justify-center text-center size-16' })}>
          <input {...getInputProps()} />
          <UploadSimple size={32} color="white"/>
          {/* <p className='text-slate-400 hidden md:block'>Select a picture</p> */}
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <Image src={image} alt="" width={200} height={200}/>
      </div>
    </section>
  );
}

export default ImageLoader