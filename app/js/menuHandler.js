(function() {
  const $ = require("jquery");
  const electron = require("electron");
  const path = require("path");
  const win = electron.remote.getCurrentWindow();
  const Menu = electron.remote.Menu;
  const opn = require("opn");
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
          label: "Open WEPL Browser",
          click: () => {
            bw.openBrowser();
          }
        },
        {
          label: "References",
          submenu: [
            {
              label: "WEPL Browser",
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
            },
            { type: "separator" },
            {
              label: "Default Browser",
              submenu: [
                {
                  label: "GitHub",
                  click: () => {
                    opn("https://github.com");
                  }
                },
                {
                  label: "Stack Overflow",
                  click: () => {
                    opn("https://stackoverflow.com");
                  }
                },
                {
                  label: "UNPKG",
                  click: () => {
                    opn("https://unpkg.com");
                  }
                },
                {
                  label: "jsDelivr",
                  click: () => {
                    opn("https://www.jsdelivr.com/");
                  }
                }
              ]
            }
          ]
        }
      ]
    })
  );
  menu.append(
    new MenuItem({
      label: "Editor",
      submenu: [
        {
          label: "Prettier : Format Document(No-click)",
          accelerator: "Shift+Alt+F",
        },
        {
          label: "Live Server",
          submenu: [
            {
              label: "Open in WEPL Browser",
              click: () => {
                bw.openBrowser("http://127.0.0.1:80");
              }
            },
            {
              label: "Open in Default Browser",
              click: () => {
                opn("http://127.0.0.1:80");
              }
            }
          ]
        }
      ]
    })
  );
  titlebar.updateMenu(menu);
  $("title").change(() => {
    titlebar.updateTitle($("title").html());
  });
})();
/* The Sideview Stuff */
function canResize(elem) {
  var borderDiv = document.createElement("div");
  borderDiv.className = "resize-border";
  borderDiv.style.width = "3px";
  borderDiv.style.zIndex = 2;
  borderDiv.style.borderRight = "1px solid #5E6269";
  borderDiv.addEventListener(
    "mousedown",
    (myresize = function myrsize(e) {
      myoffset =
        e.clientX -
        (document.querySelector(elem).offsetLeft +
          parseInt(
            window
              .getComputedStyle(document.querySelector(elem))
              .getPropertyValue("width")
          ));
      window.addEventListener("mouseup", function mouseUp() {
        document.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      });
      document.addEventListener(
        "mousemove",
        (mouseMove = function mouseMove(e) {
          document.querySelector(elem).style.width = `${e.clientX -
            myoffset -
            document.querySelector(elem).offsetLeft}px`;
        })
      );
    })
  );
  document.querySelector(elem).appendChild(borderDiv);
}
canResize(".sideview");
