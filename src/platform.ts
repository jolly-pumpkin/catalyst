import Database from 'better-sqlite3';
import { readFile, writeFile, access } from 'node:fs/promises';

export { Database };

export function openDatabase(path: string): Database.Database {
  return new Database(path);
}

export async function readFileText(path: string): Promise<string> {
  return readFile(path, 'utf-8');
}

export async function readFileBuffer(path: string): Promise<Buffer> {
  return readFile(path);
}

export async function writeFileText(path: string, content: string): Promise<void> {
  await writeFile(path, content, 'utf-8');
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
