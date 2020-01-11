
(function () {
    let $ = require('jquery')
    let fs = require('fs')

    let { remote } = require('electron')
    let win = remote.getCurrentWindow()
    let dialog = remote.dialog
    let url = require('url')
    let path = require('path')
    let ls = require(__dirname + '\\js\\server.js')
    $('document').ready(() => {
        $('.setup').click(() => {
            $('.setup-dialog').hide()
            setupStuff()
        })
        setupStuff = () => {
            dialog.showOpenDialog(win, {
                properties: ['openDirectory']
            }).then(result => {
                let __dir = result.filePaths[0]
                $('.downpanel .open-browser').click(() => {
                    ls.createWindow()
                })
                $('title').html(__dir)
                $('.titlebar-title').html($('title').html())
                ls.startServer(__dir)
                fs.readFile(path.join(__dir, './index.html'), function (err, data) {
                    if(err){
                        if (err.code === 'ENOENT') {
                        writeFileHTML('/index.html', __dir)
                    } else {
                        throw err;
                    }
                    }
                    
                    window.editorHTML.setValue(data.toString());
                    console.log(data.toString())
                })
                fs.readFile(path.join(__dir, './app.js'), function (err, data) {
                    if(err){
                        if (err.code === 'ENOENT') {
                        writeFileJS('/app.js', __dir)
                    } else {
                        throw err;
                    }
                    }
                    
                    window.editorJS.setValue(data.toString());
                    console.log(data.toString())
                })
                fs.readFile(path.join(__dir, './styles.css'), function (err, data) {
                    if(err){
                        if (err.code === 'ENOENT') {
                        writeFileCSS('/styles.css', __dir)
                    } else {
                        throw err;
                    }
                    }
                    
                    window.editorCSS.setValue(data.toString());
                    console.log(data.toString())
                })


                window.editorHTML.getModel().onDidChangeContent((evt) => {
                    writeFileHTML('/index.html', __dir)
                })
                window.editorCSS.getModel().onDidChangeContent((evt) => {
                    writeFileCSS('/styles.css', __dir)
                })
                window.editorJS.getModel().onDidChangeContent((evt) => {
                    writeFileJS('/app.js', __dir)
                })

            })
        }
        const writeFileHTML = (file, __dir) => {
            fs.writeFile(__dir + file, window.editorHTML.getValue(), { flag: 'w' }, (err) => {
                if (err) console.log(err);
            })
        }
        const writeFileCSS = (file, __dir) => {
            fs.writeFile(__dir + file, window.editorCSS.getValue(), { flag: 'w' }, (err) => {
                if (err) console.log(err);
            })
        }
        const writeFileJS = (file, __dir) => {
            fs.writeFile(__dir + file, window.editorJS.getValue(), { flag: 'w' }, (err) => {
                if (err) console.log(err);
            })
        }

    })


})()