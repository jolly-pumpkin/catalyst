import type { CatalystConfig } from '../../src/input.js';
import { registerUserHandlers } from './users.js';
import { registerPipelineHandlers } from './pipeline.js';
import { registerCompanyHandlers } from './companies.js';
import { registerKanbanHandlers } from './kanban.js';
import { registerResultsHandlers } from './results.js';
import { registerDocsHandlers } from './docs.js';
import { registerProfileHandlers } from './profile.js';
import { registerTraceHandlers } from './traces.js';

/**
 * Register all IPC handlers. Called once during app startup.
 */
export function registerAllIpc(config: CatalystConfig): void {
  registerUserHandlers(config);
  registerPipelineHandlers();
  registerCompanyHandlers();
  registerKanbanHandlers();
  registerResultsHandlers();
  registerDocsHandlers();
  registerProfileHandlers();
  registerTraceHandlers();
}
