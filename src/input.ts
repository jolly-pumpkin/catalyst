import { join, extname, dirname } from 'node:path';
import { homedir } from 'node:os';
import { mkdirSync, readdirSync, existsSync } from 'node:fs';

export interface CatalystConfig {
  docsFolder: string;
  ollamaModel: string;
  ollamaUrl: string;
  indexIntervalHours: number;
}

export async function loadConfig(): Promise<CatalystConfig> {
  const configDir = join(homedir(), '.catalyst');
  const configPath = join(configDir, 'config.json');
  const configFile = Bun.file(configPath);

  if (!(await configFile.exists())) {
    mkdirSync(configDir, { recursive: true });
    const defaults: CatalystConfig = {
      docsFolder: join(configDir, 'docs'),
      ollamaModel: 'gemma4',
      ollamaUrl: 'http://localhost:11434',
      indexIntervalHours: 6,
    };
    await Bun.write(configPath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(await configFile.text()) as CatalystConfig;
}

export async function readResumeFile(filePath: string): Promise<string> {
  const cleaned = filePath.trim().replace(/^["']|["']$/g, '');
  const resolved = cleaned.startsWith('~')
    ? join(homedir(), cleaned.slice(1))
    : cleaned;

  const file = Bun.file(resolved);
  if (!(await file.exists())) throw new Error(`File not found: ${resolved}`);

  const ext = extname(resolved).toLowerCase();

  if (ext === '.txt' || ext === '.md') {
    return await file.text();
  }

  if (ext === '.pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (ext === '.docx') {
    const mammoth = await import('mammoth');
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file format: ${ext}. Supported: .txt, .md, .pdf, .docx`);
}

export function listDocsFolder(folder: string): Array<{ name: string; path: string }> {
  try {
    return readdirSync(folder)
      .filter((f) => ['.txt', '.md', '.pdf', '.docx'].includes(extname(f).toLowerCase()))
      .map((f) => ({ name: f, path: join(folder, f) }));
  } catch {
    return [];
  }
}
