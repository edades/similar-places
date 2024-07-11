import { create } from 'zustand';

export type Place = {
  title?: string
  lat?: number
  lng?: number
}

export type State = {
  image: string
  location: Place
}

interface Action {
  setLocation: (location: Place) => void;
  setImage: (image: string) => void;
}

export const usePlaceStore = create<State & Action>((set) => ({
  image: './300.svg',
  location: {
    title: 'nolocation',
    lat: 0,
    lng: 0
  },

  setLocation: (location) => set(() => ({ location })),
  setImage: (image) => set(() => ({ image })),
}));