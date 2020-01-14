(function() {
  let $ = require("jquery");
  let fs = require("fs");
  let ipc = require("electron").ipcRenderer;
  let { remote } = require("electron");
  let globalShortcut = remote.globalShortcut;
  let win = remote.getCurrentWindow();
  let dialog = remote.dialog;
  let url = require("url");
  let path = require("path");
  let ls = require(__dirname + "\\js\\server.js");
  let bw = require(__dirname + "\\js\\browser.js");
  const Swal = require("sweetalert2");
  $("document").ready(() => {
    $(".setup").click(() => {
      setupStuff();
    });
    ipc.on("setupProject", () => {
      setupStuff();
    });
    globalShortcut.register("Alt+P", () => {
      setupStuff();
    });
    const startServer = __dir => {
      ls.startServer(__dir, true);
      $(".downpanel .open-browser").html(
        '<span class="codicon codicon-check"></span> Live'
      );
      Swal.fire({
        title: "<span style='color: #eee'>Success</span>",
        position: "top-end",
        background: "var(--main-color)",
        html:
        "<p style='color: #eee'>You're live at <b style='color: lightskyblue'>http://127.0.0.1:80</b></p>",
        icon: "success",
        confirmButtonText: "That's cool!",
      });
    };
    const setupStuff = () => {
      $(".setup-dialog").hide();
      dialog
        .showOpenDialog(win, {
          properties: ["openDirectory"]
        })
        .then(result => {
          let __dir = result.filePaths[0];
          if (__dir === undefined || __dir === null) {
            setupStuff();
          }
          $(".downpanel .open-browser").click(() => {
            startServer(__dir);
            $(".downpanel .open-browser").css("pointer-events", "none");
            $(".downpanel .open-browser").css("color", "#666");
          });
          $("title")
            .html(__dir + " - WEPL")
            .trigger("change");
          fs.readFile(path.join(__dir, "./index.html"), function(err, data) {
            if (err) {
              if (err.code === "ENOENT") {
                writeFileHTML("/index.html", __dir);
              } else {
                throw err;
              }
            }

            window.editorHTML.setValue(data.toString());
          });
          fs.readFile(path.join(__dir, "./app.js"), function(err, data) {
            if (err) {
              if (err.code === "ENOENT") {
                writeFileJS("/app.js", __dir);
              } else {
                throw err;
              }
            }

            window.editorJS.setValue(data.toString());
          });
          fs.readFile(path.join(__dir, "./styles.css"), function(err, data) {
            if (err) {
              if (err.code === "ENOENT") {
                writeFileCSS("/styles.css", __dir);
              } else {
                throw err;
              }
            }

            window.editorCSS.setValue(data.toString());
          });

          window.editorHTML.getModel().onDidChangeContent(evt => {
            writeFileHTML("/index.html", __dir);
          });
          window.editorCSS.getModel().onDidChangeContent(evt => {
            writeFileCSS("/styles.css", __dir);
          });
          window.editorJS.getModel().onDidChangeContent(evt => {
            writeFileJS("/app.js", __dir);
          });
        });
    };
    const writeFileHTML = (file, __dir) => {
      fs.writeFile(
        __dir + file,
        window.editorHTML.getValue(),
        { flag: "w" },
        err => {
          if (err) console.log(err);
        }
      );
    };
    const writeFileCSS = (file, __dir) => {
      fs.writeFile(
        __dir + file,
        window.editorCSS.getValue(),
        { flag: "w" },
        err => {
          if (err) console.log(err);
        }
      );
    };
    const writeFileJS = (file, __dir) => {
      fs.writeFile(
        __dir + file,
        window.editorJS.getValue(),
        { flag: "w" },
        err => {
          if (err) console.log(err);
        }
      );
    };
  });
})();
