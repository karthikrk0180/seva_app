import { StateStorage } from 'zustand/middleware';

// Mock AsyncStorage wrapper to avoid runtime errors if package is missing during skeleton generation
// In production, this should import AsyncStorage from '@react-native-async-storage/async-storage'
export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log(name, 'has been retrieved');
    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log(name, 'with value', value, 'has been saved');
  },
  removeItem: async (name: string): Promise<void> => {
    // console.log(name, 'has been deleted');
  },
};
