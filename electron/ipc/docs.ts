import { ipcMain, dialog, BrowserWindow } from 'electron';
import http from 'node:http';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getCatalystContext } from '../../src/context.js';
import { listDocsFolder, readResumeFile } from '../../src/input.js';

export function registerDocsHandlers(): void {
  ipcMain.handle(IPC.DOCS_LIST, () => {
    const ctx = getCatalystContext();
    return listDocsFolder(ctx.docsDir);
  });

  ipcMain.handle(IPC.DOCS_READ, async (_event, filePath: string) => {
    const { resolve, sep } = await import('node:path');
    const ctx = getCatalystContext();
    const resolved = resolve(filePath);
    const prefix = ctx.docsDir.endsWith(sep) ? ctx.docsDir : ctx.docsDir + sep;
    if (!resolved.startsWith(prefix) && resolved !== ctx.docsDir) {
      throw new Error('Path outside user docs directory');
    }
    return readResumeFile(resolved);
  });

  ipcMain.handle(IPC.DOCS_IMPORT, async () => {
    const { basename, join } = await import('node:path');
    const { copyFile, mkdir } = await import('node:fs/promises');

    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win!, {
      title: 'Import Resume',
      filters: [
        { name: 'Documents', extensions: ['txt', 'md', 'pdf'] },
      ],
      properties: ['openFile'],
    });
    if (result.canceled || result.filePaths.length === 0) return null;

    const srcPath = result.filePaths[0];
    const ctx = getCatalystContext();
    await mkdir(ctx.docsDir, { recursive: true });
    const name = basename(srcPath);
    const destPath = join(ctx.docsDir, name);
    await copyFile(srcPath, destPath);
    return { name, path: destPath };
  });

  ipcMain.handle(IPC.SETTINGS_GET, async () => {
    // Settings are loaded from config — re-read for freshness
    const { loadConfig } = await import('../../src/input.js');
    return loadConfig();
  });

  ipcMain.handle(IPC.SETTINGS_SET, async (_event, key: string, value: unknown) => {
    const ALLOWED_KEYS = new Set(['ollamaModel', 'ollamaUrl', 'indexIntervalHours']);
    if (!ALLOWED_KEYS.has(key)) {
      throw new Error(`Unknown config key: ${key}`);
    }

    const { loadConfig } = await import('../../src/input.js');
    const { join } = await import('node:path');
    const { homedir } = await import('node:os');
    const { writeFileText } = await import('../../src/platform.js');

    const config = await loadConfig();
    (config as Record<string, unknown>)[key] = value;
    const configPath = join(homedir(), '.catalyst', 'config.json');
    await writeFileText(configPath, JSON.stringify(config, null, 2));
    return config;
  });

  ipcMain.handle(IPC.OLLAMA_MODELS, async () => {
    const { loadConfig } = await import('../../src/input.js');
    const config = await loadConfig();
    const baseUrl = config.ollamaUrl ?? 'http://localhost:11434';
    const url = new URL('/api/tags', baseUrl);

    const data: { models: Array<{ name: string; size: number; details?: { parameter_size?: string; quantization_level?: string } }> } = await new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Ollama error ${res.statusCode}`));
          } else {
            resolve(JSON.parse(Buffer.concat(chunks).toString()));
          }
        });
      });
      req.on('error', (err) => reject(new Error(`Ollama unreachable at ${baseUrl}: ${err.message}`)));
    });

    return data.models.map((m) => ({
      name: m.name,
      size: m.size,
      parameterSize: m.details?.parameter_size,
      quantization: m.details?.quantization_level,
    }));
  });
}
