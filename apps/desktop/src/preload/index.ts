import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  showMessage: (message: string) => ipcRenderer.send('show-message', message),
  getAppVersion: async () => await ipcRenderer.invoke('get-app-version'),
  login: () => ipcRenderer.invoke('initiate-login'),
  onAuthSuccess: (callback: (token: string) => void) => {
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'auth-success') {
        callback(event.data.token);
      }
    });
  },
  handleProtocolUrl: (callback: (e: IpcRendererEvent, url: string) => void) => {
    return ipcRenderer.on('protocol-url', callback);
  },
  saveSession: async (data: { sessionToken: string }) => {
    return await ipcRenderer.invoke('save-session', data);
  },
  getSession: async (): Promise<string | null> => {
    return await ipcRenderer.invoke('get-session');
  },
  clearSession: () => {
    ipcRenderer.send('clear-session');
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
