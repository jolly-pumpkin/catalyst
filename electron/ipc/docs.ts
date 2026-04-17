import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getCatalystContext } from '../../src/context.js';
import { listDocsFolder, readResumeFile } from '../../src/input.js';

export function registerDocsHandlers(): void {
  ipcMain.handle(IPC.DOCS_LIST, () => {
    const ctx = getCatalystContext();
    return listDocsFolder(ctx.docsDir);
  });

  ipcMain.handle(IPC.DOCS_READ, async (_event, path: string) => {
    return readResumeFile(path);
  });

  ipcMain.handle(IPC.SETTINGS_GET, async () => {
    // Settings are loaded from config — re-read for freshness
    const { loadConfig } = await import('../../src/input.js');
    return loadConfig();
  });

  ipcMain.handle(IPC.SETTINGS_SET, async (_event, key: string, value: unknown) => {
    const { loadConfig } = await import('../../src/input.js');
    const { join } = await import('node:path');
    const { homedir } = await import('node:os');
    const { writeFileText } = await import('../../src/platform.js');

    const config = await loadConfig();
    (config as any)[key] = value;
    const configPath = join(homedir(), '.catalyst', 'config.json');
    await writeFileText(configPath, JSON.stringify(config, null, 2));
    return config;
  });
}
