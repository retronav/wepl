const fs = require('fs')
const win = remote.getCurrentWindow()
const dialog = remote.dialog
const url = require('url')
const path = require('path')
const ls = require(__dirname + '\\js\\server.js')
const $ = require('jquery')
const { app, Menu } = require('electron').remote
const { remote } = require('electron')
const isMac = process.platform === 'darwin'