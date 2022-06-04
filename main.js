const { app, BrowserWindow, clipboard, ipcMain } = require('electron')
const path = require('path')
const shortcut = require('electron-localshortcut')
const { autoUpdater } = require("electron-updater")
require("v8-compile-cache");

function settings() {
  app.commandLine.appendSwitch("disable-web-security", "true")
  app.commandLine.appendSwitch("disable-gpu-vsync");
  app.commandLine.appendSwitch("disable-frame-rate-limit");
  app.commandLine.appendSwitch("enable-pointer-lock-options");
  app.commandLine.appendSwitch("enable-quic");
  app.commandLine.appendSwitch("disable-accelerated-video-decode", "false");
  app.commandLine.appendSwitch('use-angle', 'd3d9');
  app.commandLine.appendSwitch('enable-webgl2-compute-context');
  app.commandLine.appendSwitch("ignore-gpu-blacklist");
  console.log("settings enabled")
}

ipcMain.on('close', (event, arg) => {
  app.quit();
})

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  settings();
  win.loadURL('https://ev.io/')

  win.once('ready-to-show', () => {
    win.show()
  })

  shortcut.register(win, 'F11', () => {
    win.setFullScreen(!win.isFullScreen());
  });

  shortcut.register(win, 'F5', () => {
    win.loadURL("https://ev.io/");
  });

  shortcut.register(win, 'F6', () => {
    win.loadURL(clipboard.readText());
  });

  shortcut.register(win, 'ALT+F4', () => {
    app.quit();
  });

  shortcut.register(win, 'ESC', () => {
    win.webContents.send('menu');
  });

  shortcut.register(win, 'F12', () => {
    win.webContents.openDevTools()
  });
});

autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();
});

app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
  if (window.webContents.getURL() == "https://ev.io/") {
    window.close();
  }
  ipcMain.on('close', () => {
    app.quit();
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
