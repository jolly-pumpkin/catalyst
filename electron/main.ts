import 'dotenv/config';
import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { createBroker } from 'rhodium-core';
import { createPipelineRunnerPlugin } from 'rhodium-pipeline-runner';
import type { Broker } from 'rhodium-core';

import { ollamaProviderPlugin } from '../src/plugins/ollama-provider.js';
import { resultsStorePlugin } from '../src/plugins/results-store.js';
import { traceStorePlugin } from '../src/plugins/trace-store.js';
import { catalogDbPlugin } from '../src/plugins/catalog-db.js';
import { atsDetectorPlugin } from '../src/plugins/ats-detector.js';
import { companyStorePlugin } from '../src/plugins/company-store.js';
import { jobIndexStorePlugin } from '../src/plugins/job-index-store.js';
import { jobIndexerPlugin } from '../src/plugins/job-indexer.js';
import { indexFetcherPlugin } from '../src/plugins/index-fetcher.js';
import { remotiveFetcherPlugin } from '../src/plugins/remotive-fetcher.js';
import { profileParserPlugin } from '../src/plugins/profile-parser.js';
import { jobNormalizerPlugin } from '../src/plugins/job-normalizer.js';
import { skillMatcherPlugin } from '../src/plugins/skill-matcher.js';
import { cultureFitAnalyzerPlugin } from '../src/plugins/culture-fit-analyzer.js';
import { salaryEstimatorPlugin } from '../src/plugins/salary-estimator.js';
import { synthesizerPlugin } from '../src/plugins/synthesizer.js';
import { reflectionAgentPlugin } from '../src/plugins/reflection-agent.js';
import { userManagerPlugin } from '../src/plugins/user-manager.js';
import { kanbanStorePlugin } from '../src/plugins/kanban-store.js';

import { loadConfig, type CatalystConfig } from '../src/input.js';
import { setCatalystContext, buildUserContext } from '../src/context.js';
import { registerAllIpc } from './ipc/index.js';
import { stopScheduler } from './scheduler.js';

// Vite dev server / production build declarations
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

// --- Module-level state ---

let mainWindow: BrowserWindow | null = null;
let userBroker: Broker | null = null;
let appBroker: Broker | null = null;
let currentConfig: CatalystConfig | null = null;
let currentModel = 'gemma4';

// --- Exported accessors ---

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getBroker(): Broker | null {
  return appBroker;
}

export function getUserBroker(): Broker | null {
  return userBroker;
}

export function getConfig(): CatalystConfig | null {
  return currentConfig;
}

export function getModel(): string {
  return currentModel;
}

// --- Broker factories ---

/** Create the lightweight user-management broker (no per-user context needed). */
export async function createUserBroker(): Promise<Broker> {
  const broker = createBroker({ debug: false });
  broker.register(userManagerPlugin());
  await broker.activate();
  userBroker = broker;
  return broker;
}

/** Create and activate the full per-user broker with all plugins. */
export async function createAppBroker(config: CatalystConfig, model: string): Promise<Broker> {
  // Tear down previous broker if switching users
  if (appBroker) {
    stopScheduler();
    await appBroker.deactivate();
    appBroker = null;
  }

  currentModel = model;
  const broker = createBroker({ debug: false });

  // Infrastructure
  broker.register(ollamaProviderPlugin({ model, baseUrl: config.ollamaUrl }));
  broker.register(resultsStorePlugin());
  broker.register(traceStorePlugin());
  broker.register(createPipelineRunnerPlugin());

  // Job indexer stack
  broker.register(catalogDbPlugin());
  broker.register(atsDetectorPlugin());
  broker.register(companyStorePlugin());
  broker.register(jobIndexStorePlugin());
  broker.register(jobIndexerPlugin({
    intervalHours: config.indexIntervalHours,
    autoStart: false, // Scheduler manages indexing in Electron
  }));

  // Kanban
  broker.register(kanbanStorePlugin());

  // Job sources (pipeline fetchers)
  broker.register(indexFetcherPlugin());
  broker.register(remotiveFetcherPlugin());

  // Pipeline stages
  broker.register(profileParserPlugin());
  broker.register(jobNormalizerPlugin());
  broker.register(skillMatcherPlugin());
  broker.register(cultureFitAnalyzerPlugin());
  broker.register(salaryEstimatorPlugin());
  broker.register(synthesizerPlugin());
  broker.register(reflectionAgentPlugin());

  await broker.activate();
  appBroker = broker;

  return broker;
}

// --- Window creation ---

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow = win;

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

// --- App lifecycle ---

app.whenReady().then(async () => {
  // Load config
  currentConfig = await loadConfig();
  currentModel = currentConfig.ollamaModel;

  // Create the user-management broker (global, not per-user)
  await createUserBroker();

  // Register all IPC handlers
  registerAllIpc(currentConfig);

  // Create the main window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async (e) => {
  e.preventDefault();
  stopScheduler();
  if (appBroker) {
    await appBroker.deactivate();
    appBroker = null;
  }
  if (userBroker) {
    await userBroker.deactivate();
    userBroker = null;
  }
  app.exit(0);
});
