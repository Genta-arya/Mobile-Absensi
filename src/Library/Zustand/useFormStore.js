// useStore.js
import {create} from 'zustand';

const useFormStore = create(set => ({
  detail: '',
  gps: '',
  tanggal: '',
  gambar1: null,
  gambar2: null,
  setDetail: (detail) => set({ detail }),
  setGps: (gps) => set({ gps }),
  setTanggal: (tanggal) => set({ tanggal }),
  setGambar1: (gambar) => set({ gambar1: gambar }),
  setGambar2: (gambar) => set({ gambar2: gambar }),
}));

export default useFormStore;
