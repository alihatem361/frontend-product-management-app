'use client';

/**
 * Providers.tsx
 *
 * Client-side wrapper that provides the Redux store to the entire app.
 * Must be a Client Component because Redux's Provider uses React context.
 * This pattern is required by Next.js App Router.
 */

import { Provider } from 'react-redux';
import { store } from '@/lib/store';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
