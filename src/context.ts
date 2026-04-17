import { join } from 'node:path';
import { homedir } from 'node:os';

export interface CatalystContext {
  userName: string;
  userDataDir: string;
  docsDir: string;
  dbPaths: {
    catalog: string;
    results: string;
    traces: string;
  };
}

let CURRENT_CONTEXT: CatalystContext | null = null;

export function setCatalystContext(ctx: CatalystContext): void {
  CURRENT_CONTEXT = ctx;
}

export function getCatalystContext(): CatalystContext {
  if (!CURRENT_CONTEXT) throw new Error('Catalyst context not initialized — call setCatalystContext first');
  return CURRENT_CONTEXT;
}

export function buildUserContext(userName: string): CatalystContext {
  const userDataDir = join(homedir(), '.catalyst', 'users', userName);
  return {
    userName,
    userDataDir,
    docsDir: join(userDataDir, 'docs'),
    dbPaths: {
      catalog: join(userDataDir, 'catalyst.db'),
      results: join(userDataDir, 'results.db'),
      traces: join(userDataDir, 'traces.db'),
    },
  };
}
