import {create} from 'zustand';

export const useGroupStore = create((set) => ({
    groupName: '',
    setGroupName: (name) => set({ groupName: name }),
}));