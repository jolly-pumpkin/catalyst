import React, { createContext, useContext } from 'react';
import type { CatalystAPI } from '../../electron/preload.js';

declare global {
  interface Window {
    catalyst: CatalystAPI;
  }
}

const ApiContext = createContext<CatalystAPI>(null as unknown as CatalystAPI);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(ApiContext.Provider, { value: window.catalyst }, children);
}

export function useApi(): CatalystAPI {
  return useContext(ApiContext);
}
