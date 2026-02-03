import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { create } from 'zustand';
import { logger } from './logger.service';

interface VoiceState {
  isListening: boolean;
  results: string[];
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  cancelListening: () => Promise<void>;
  reset: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => {
  
  // Setup Listeners
  Voice.onSpeechStart = () => set({ isListening: true, error: null });
  Voice.onSpeechEnd = () => set({ isListening: false });
  Voice.onSpeechResults = (e: SpeechResultsEvent) => set({ results: e.value || [] });
  Voice.onSpeechError = (e: SpeechErrorEvent) => {
    logger.error('Voice Error', e);
    set({ isListening: false, error: e.error?.message || 'Unknown Error' });
  };

  return {
    isListening: false,
    results: [],
    error: null,

    startListening: async () => {
      try {
        set({ results: [], error: null });
        await Voice.start('en-IN'); // Defaulting to Indian English, can switch to 'kn-IN'
      } catch (e) {
        logger.error('Failed to start voice', e);
      }
    },

    stopListening: async () => {
      try {
        await Voice.stop();
      } catch (e) {
        logger.error('Failed to stop voice', e);
      }
    },

    cancelListening: async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            logger.error('Failed to cancel voice', e);
        }
    },

    reset: () => set({ results: [], error: null, isListening: false }),
  };
});
