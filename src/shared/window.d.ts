import type { CatalystAPI } from '../../electron/preload.js';

declare global {
  interface Window {
    catalyst: CatalystAPI;
  }
}
