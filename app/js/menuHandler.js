(function() {
  const $ = require('jquery')
  const electron = require("electron");
  const path = require("path");
  const win = electron.remote.getCurrentWindow();
  const Menu = electron.remote.Menu;
  const MenuItem = electron.remote.MenuItem;
  let bw = require(__dirname + "\\js\\browser.js");
  const customTitlebar = require("custom-electron-titlebar");

  const titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#2b2f36"),
    icon: "../app/icon/appicon.ico"
  });
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Project",
      submenu: [
        {
          label: "Setup Project",
          accelerator: "Alt+P",
          click: () => win.webContents.send("setupProject")
        },
        {
          type: "separator"
        }
      ]
    })
  );
  menu.append(
    new MenuItem({
      label: "Window",
      submenu: [
        {
          label: "Open DevTools",
          accelerator: "CmdOrCtrl+Shift+I",
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
    })
  );
  menu.append(
    new MenuItem({
      label: "Browser",
      submenu: [
        {
          label: "Open Browser",
          click: () => {
            bw.openBrowser();
          }
        },
        {
          label: "References",
          submenu: [
            {
              label: "GitHub",
              click: () => {
                bw.openBrowser("https://github.com");
              }
            },
            {
              label: "Stack Overflow",
              click: () => {
                bw.openBrowser("https://stackoverflow.com");
              }
            },
            {
              label: "UNPKG",
              click: () => {
                bw.openBrowser("https://unpkg.com");
              }
            },
            {
              label: "jsDelivr",
              click: () => {
                bw.openBrowser("https://www.jsdelivr.com/");
              }
            }
          ]
        }
      ]
    })
  );
  titlebar.updateMenu(menu);
  $('title').change(() => {
    titlebar.updateTitle($('title').html())
  })
})();
