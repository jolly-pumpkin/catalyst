import { createWriteStream, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { WriteStream } from 'node:fs';

const LOG_DIR = join(homedir(), '.catalyst', 'logs');
const MAX_AGE_DAYS = 7;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

let stream: WriteStream | null = null;

function dateTag(): string {
  return new Date().toISOString().slice(0, 10);
}

function ensureStream(): WriteStream {
  if (!stream) {
    mkdirSync(LOG_DIR, { recursive: true });
    stream = createWriteStream(join(LOG_DIR, `catalyst-${dateTag()}.log`), { flags: 'a' });
  }
  return stream;
}

function write(level: LogLevel, source: string, message: string, data?: unknown): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    source,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  ensureStream().write(JSON.stringify(entry) + '\n');
}

/** Prune log files older than MAX_AGE_DAYS. Call once at startup. */
export function pruneOldLogs(): void {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    for (const name of readdirSync(LOG_DIR)) {
      const match = name.match(/^catalyst-(\d{4}-\d{2}-\d{2})\.log$/);
      if (match && new Date(match[1]).getTime() < cutoff) {
        unlinkSync(join(LOG_DIR, name));
      }
    }
  } catch {
    // Best-effort cleanup
  }
}

export const log = {
  debug: (source: string, message: string, data?: unknown) => write('debug', source, message, data),
  info:  (source: string, message: string, data?: unknown) => write('info', source, message, data),
  warn:  (source: string, message: string, data?: unknown) => write('warn', source, message, data),
  error: (source: string, message: string, data?: unknown) => write('error', source, message, data),
};
