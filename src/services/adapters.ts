import { functions } from '@services/firebase';
import { httpsCallable } from 'firebase/functions';

export const DAILY_API_ACTIONS = {
  GET_DAILY: 'GET_DAILY',
  SAVE_DRAWING: 'SAVE_DRAWING',
  SAVE_TESTIMONIES: 'SAVE_TESTIMONIES',
  SAVE_CONEXOES: 'SAVE_CONEXOES',
} as const;

/**
 * Daily API cloud function v2
 */
export const DAILY_API = {
  run: httpsCallable(functions, 'dailyEngine'),
};
