(function () {
    let $ = require('jquery')
    let { app, Menu } = require('electron').remote
    let { remote } = require('electron')
    var win = remote.getCurrentWindow()
    function resizeE(elem) {
        var borderDiv = document.createElement("div");
        borderDiv.className = "resize-border";
        borderDiv.addEventListener("mousedown", myresize = function myrsize(e) {
            myoffset = e.clientX - (document.querySelector(elem).offsetLeft + parseInt(window.getComputedStyle(document.querySelector(elem)).getPropertyValue("width")));
            window.addEventListener("mouseup", function mouseUp() {
                document.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mouseup", mouseUp);
            });
            document.addEventListener("mousemove", mouseMove = function mouseMove(e) {
                document.querySelector(elem).style.width = `${e.clientX - myoffset - document.querySelector(elem).offsetLeft}px`;
            });
        });
        document.querySelector(elem).appendChild(borderDiv);
    }

    $('document').ready(() => {
        $('.titlebar-title').html($('title').html())
        $('.min').on('click', function () {
            win.minimize()
        })
        $('.close').on('click', function () {
            win.close()
        })
        setInterval(() => {
            if (!win.isMaximized()) {
                $('.max span').removeClass('codicon-chrome-restore')
                $('.max span').addClass('codicon-chrome-maximize')
            }
            else {
                $('.max span').removeClass('codicon-chrome-maximize')
                $('.max span').addClass('codicon-chrome-restore')
            }
        }, 100)

        $('.max').on('click', () => {
            if (win.isMaximized()) {
                win.unmaximize();
                $('.max span').removeClass('codicon-chrome-restore')
                $('.max span').addClass('codicon-chrome-maximize')
            } else {
                win.maximize();
                $('.max span').removeClass('codicon-chrome-maximize')
                $('.max span').addClass('codicon-chrome-restore')
            }
        })
        resizeE('.sideview')
        if (process.platform === 'darwin')
            $('.titlebar .buttons').hide()
    })



})()