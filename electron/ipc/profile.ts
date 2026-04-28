import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker, getMainWindow } from '../main.js';
import type { CandidateProfile, PipelineInput } from '../../src/types.js';

export function registerProfileHandlers(): void {
  ipcMain.handle(IPC.PROFILE_GET, () => {
    const broker = getBroker();
    if (!broker) return null;
    const store = broker.resolve<{
      getWithMeta(): { profile: CandidateProfile; sourceResume: string; updatedAt: string } | null;
    }>('profile.store');
    return store.getWithMeta();
  });

  ipcMain.handle(IPC.PROFILE_PARSE, async (_event, resumeText: string, resumeName: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const parser = broker.resolve<(input: PipelineInput) => Promise<CandidateProfile>>('profile.parse');
    const profile = await parser({ resumeText, resumeName });

    const store = broker.resolve<{
      save(profile: CandidateProfile, sourceResume: string): void;
    }>('profile.store');
    store.save(profile, resumeName);

    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.webContents.send(IPC.PIPELINE_ENRICHMENT, { profile });
    }

    return profile;
  });

  ipcMain.handle(IPC.PROFILE_SAVE, (_event, profile: CandidateProfile) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');

    const store = broker.resolve<{
      getWithMeta(): { profile: CandidateProfile; sourceResume: string; updatedAt: string } | null;
      save(profile: CandidateProfile, sourceResume: string): void;
    }>('profile.store');

    const existing = store.getWithMeta();
    store.save(profile, existing?.sourceResume ?? 'manual-edit');
  });
}
