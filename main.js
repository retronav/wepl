const Config = require('electron-config')
const config = new Config()
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
app.disableHardwareAcceleration()
function createWindow() {
  // Create the browser window.
  let opts = {}
  config.get('winBounds') !== null ?
   Object.assign(opts, config.get('winBounds')) :
    opts = {width : 1000 , height : 800}
  let win = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    resizable: true,
    icon: __dirname + '/app/icon/appicon.ico',
    webPreferences: {
      nodeIntegration: true,
    }
  })
  win.setBounds(opts)
  const __APP = '/app/'
  win.loadURL(url.format({
    pathname: path.join(__dirname, __APP, 'editor.html'),
    protocol: 'file:',
    slashes: true

  }))
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  win.on('close', () => {
    win.width = undefined
    win.height = undefined
    config.set('winBounds', win.getBounds())
  })
  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

app.on('ready', function () {
  setTimeout(function () {
    createWindow();
  }, 10);
});