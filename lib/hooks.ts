/**
 * hooks.ts
 *
 * Typed versions of Redux hooks.
 * Always use these instead of the plain `useDispatch` and `useSelector`
 * to get correct TypeScript inference throughout the app.
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Pre-typed dispatch hook — includes RTK Query action types */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Pre-typed selector hook — infers RootState automatically */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
