import { create } from 'zustand';

export type Place = {
  title?: string
  lat?: number
  lng?: number
}

export type State = {
  image: string
  location: Place
  isLoading: boolean
}

interface Action {
  setLocation: (location: Place) => void;
  setImage: (image: string) => void
  setLoading: (isLoading: boolean) => void;
}

export const usePlaceStore = create<State & Action>((set) => ({
  image: './300.svg',
  location: {
    title: 'nolocation',
    lat: 0,
    lng: 0
  },
  isLoading: false,

  setLocation: (location) => set(() => ({ location })),
  setImage: (image) => set(() => ({ image })),
  setLoading: (isLoading) => set(() => ({ isLoading })),
}));