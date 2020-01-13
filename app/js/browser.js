const electron = require("electron");
const app = electron.remote.app;
const BrowserWindow = electron.remote.BrowserWindow;
const Menu = electron.remote.Menu;
function openBrowser(urlToLoad) {
  const path = require("path");
  const url = require("url");
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, "../icon/appicon.ico"),
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });
  if (urlToLoad) {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "../browser.html"),
        protocol: "file:",
        slashes: true,
        query: {
          goto: url.format(urlToLoad)
        }
      })
    );
  } else
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "../browser.html"),
        protocol: "file:",
        slashes: true
      })
    );
  var menu = Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        {
          label: "Exit",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Open DevTools",
          accelerator: "CmdOrCtrl+Shift+I",
          // click: () => win.webContents.send("openWebviewDevTools")
          click: () => win.webContents.openDevTools()
        },
        { type: "separator" },
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => win.webContents.reload()
        },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => win.webContents.reloadIgnoringCache()
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
  app.on("ready", function() {
    openBrowser(urlToLoad);
  });

  app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", function() {
    if (mainWindow === null) {
      openBrowser(urlToLoad);
    }
  });
}
module.exports.openBrowser = openBrowser;
