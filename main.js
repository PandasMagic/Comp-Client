const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const Store = require('electron-store')
const { autoUpdater } = require("electron-updater")

const store = new Store();

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
}

const start = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')

    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL('https://ev.io/')

  mainWindow.once('ready-to-show', () => {
    mainWindow.setTitle("Comp Client")
    mainWindow.show()
  })
}

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
  settings();
  start();
});

autoUpdater.on('update-not-available', (info) => {

})
autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();
});

app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
  if (window.webContents.getURL() == "https://ev.io/") {
    window.close();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})