import { app, BrowserWindow, ipcMain, session, shell } from 'electron';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';
import { electronApp, is } from '@electron-toolkit/utils';
import { DesktopSessionManager } from './session-manager';
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client';

if (!app.requestSingleInstanceLock()) {
  app.exit(0);
}

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 384,
    minHeight: 384,
    show: false,
    autoHideMenuBar: true,
    icon: process.platform === 'linux' ? icon : undefined,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true,
      contextIsolation: true
    }
  });

  mainWindow.on('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const filePath = `file://${join(__dirname, '../renderer/index.html')}`;
  mainWindow
    .loadURL(
      is.dev && process.env['ELECTRON_RENDERER_URL']
        ? process.env['ELECTRON_RENDERER_URL']
        : filePath
    )
    .catch((err) => console.error('Window failed to load:', err));
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(async () => {
  // Create the main window on app ready
  createWindow();

  // Set security policies
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ${import.meta.env.VITE_BACKEND_URL};`
        ]
      }
    });
  });

  // Set app user model ID for Windows
  electronApp.setAppUserModelId('com.logtheway');

  // Set up IPC handlers
  ipcMain.on('ping', () => console.log('pong'));
  ipcMain.handle('save-session', async (_, { sessionToken }: { sessionToken: string }) => {
    await DesktopSessionManager.saveSession(sessionToken);
  });
  ipcMain.handle('get-session', async () => {
    return await DesktopSessionManager.getSession();
  });
  ipcMain.on('clear-session', async () => {
    await DesktopSessionManager.clearSession();
  });

  // Initialize the deep link handling
  electronAppUniversalProtocolClient.on('request', async (requestUrl) => {
    // Optionally, send the request URL to the renderer for further handling
    if (mainWindow) {
      mainWindow.webContents.send('protocol-url', requestUrl);
      mainWindow.focus();
    }
  });

  // Register the protocol client with the appropriate mode
  await electronAppUniversalProtocolClient.initialize({
    protocol: 'logtheway', // Set your app protocol here
    mode: is.dev ? 'development' : 'production'
  });
});
