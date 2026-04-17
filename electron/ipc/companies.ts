import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { getBroker } from '../main.js';
import type { CompanySource } from '../../src/types.js';

export function registerCompanyHandlers(): void {
  ipcMain.handle(IPC.COMPANIES_LIST, async () => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const store = broker.resolve<{ list(): Promise<CompanySource[]> }>('company.store');
    return store.list();
  });

  ipcMain.handle(IPC.COMPANIES_ADD, async (_event, url: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const store = broker.resolve<{ add(url: string): Promise<CompanySource> }>('company.store');
    return store.add(url);
  });

  ipcMain.handle(IPC.COMPANIES_REMOVE, async (_event, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const store = broker.resolve<{ remove(id: string): Promise<void> }>('company.store');
    return store.remove(id);
  });

  ipcMain.handle(IPC.COMPANIES_TOGGLE, async (_event, id: string, enabled: boolean) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const store = broker.resolve<{
      setEnabled(id: string, enabled: boolean): Promise<void>;
    }>('company.store');
    return store.setEnabled(id, enabled);
  });

  ipcMain.handle(IPC.INDEX_RUN, async () => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const indexer = broker.resolve<{ indexNow(): Promise<void> }>('indexer.run');
    return indexer.indexNow();
  });

  ipcMain.handle(IPC.INDEX_COMPANY, async (_event, id: string) => {
    const broker = getBroker();
    if (!broker) throw new Error('No user selected');
    const indexer = broker.resolve<{ indexCompany(id: string): Promise<void> }>('indexer.run');
    return indexer.indexCompany(id);
  });
}
