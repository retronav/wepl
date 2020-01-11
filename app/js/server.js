function startServer(__dir) {
    var liveServer = require("live-server");
    var path = require('path')

    var params = {
        port: 80, // Set the server port. Defaults to 8080.
        host: "127.0.0.1", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
        root: __dir + '\\', // Set root directory that's being served. Defaults to cwd.
        open: false, // When false, it won't load your browser by default.
        ignore: '', // comma-separated string for paths to ignore
        file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
        wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
        mount: [['/components', './node_modules']], // Mount a directory to a route.
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
        middleware: [function (req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
    };
    liveServer.start(params);
}
function createWindow() {
    const { remote } = require('electron')
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;
    let win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon : path.join(__dirname, '../icon/appicon.ico'),
        resizable: true,
        title: "Web Server",
        webPreferences: {
            nodeIntegration: true,
            preload : `file://${__dirname}/promptHandler.js`
        }
    })
    win.loadURL('http://127.0.0.1:80/')
}
module.exports.startServer = startServer;
module.exports.createWindow = createWindow;