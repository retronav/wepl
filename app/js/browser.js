const { app } = require("electron");
const electron = require("electron");
const BrowserWindow = electron.remote.BrowserWindow;
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
        query : {
          "goto" : url.format(urlToLoad)
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
