import { ipcMain } from 'electron';
import { IPC } from '../../src/shared/ipc-channels.js';
import { setCatalystContext, buildUserContext } from '../../src/context.js';
import { getUserBroker, createAppBroker, getMainWindow, getBroker } from '../main.js';
import { wireBrokerEvents } from '../events.js';
import { startScheduler } from '../scheduler.js';
import type { CatalystConfig } from '../../src/input.js';
import type { UserManagerCapability } from '../../src/plugins/user-manager.js';

export function registerUserHandlers(config: CatalystConfig): void {
  ipcMain.handle(IPC.USERS_LIST, () => {
    const broker = getUserBroker();
    if (!broker) throw new Error('User broker not initialized');
    const manager = broker.resolve<UserManagerCapability>('user.manager');
    return manager.list();
  });

  ipcMain.handle(IPC.USERS_CREATE, (_event, name: string) => {
    const broker = getUserBroker();
    if (!broker) throw new Error('User broker not initialized');
    const manager = broker.resolve<UserManagerCapability>('user.manager');
    return manager.create(name);
  });

  ipcMain.handle(IPC.USERS_SELECT, async (_event, id: string) => {
    const userBroker = getUserBroker();
    if (!userBroker) throw new Error('User broker not initialized');

    const manager = userBroker.resolve<UserManagerCapability>('user.manager');
    const user = manager.get(id);
    if (!user) throw new Error(`User not found: ${id}`);

    // Set current user
    manager.setCurrentId(id);

    // Set per-user context for DB paths
    const ctx = buildUserContext(user.name);
    setCatalystContext(ctx);

    // Create per-user broker (tears down old one if exists)
    const appBroker = await createAppBroker(config, config.ollamaModel);

    // Wire broker events to renderer
    const win = getMainWindow();
    if (win) {
      wireBrokerEvents(appBroker, win);
    }

    // Start background scheduler
    startScheduler(appBroker, config);

    return user;
  });
}
