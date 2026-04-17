import { describe, it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
import { readResumeFile } from './input.js';

describe('readResumeFile', () => {
  it('reads a .txt file', async () => {
    writeFileSync('/tmp/test-resume.txt', 'Jane Doe, Senior Engineer');
    const text = await readResumeFile('/tmp/test-resume.txt');
    expect(text).toContain('Jane Doe');
  });

  it('strips macOS drag-drop quotes', async () => {
    writeFileSync('/tmp/test-resume.txt', 'Jane Doe');
    const text = await readResumeFile(`"/tmp/test-resume.txt"`);
    expect(text).toContain('Jane Doe');
  });

  it('throws for unsupported extension', async () => {
    writeFileSync('/tmp/resume.xyz', 'test');
    await expect(readResumeFile('/tmp/resume.xyz')).rejects.toThrow('Unsupported');
  });

  it('throws for missing file', async () => {
    await expect(readResumeFile('/tmp/nonexistent-file.txt')).rejects.toThrow('File not found');
  });
});
