const $ = require("jquery");
$("document").ready(() => {
  const searchBar = document.querySelector(".search-bar");
  const refresh = document.querySelector(".refresh");
  const back = document.querySelector(".back");
  const forward = document.querySelector(".forward");
  const submit = document.querySelector(".submit");
  const view = document.querySelector("webview");
  view.shadowRoot
    .querySelector("iframe")
    .setAttribute(
      "sandbox",
      "allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
    );
  view.shadowRoot
    .querySelector("iframe")
    .setAttribute(
      "allow",
      "geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
    );
  let win = require("electron").remote.getCurrentWindow();
  const ipc = require("electron").ipcRenderer;
  //Simple handler to open devTools for webview and not for main process
  ipc.on("openWebviewDevTools", () => {
    view.openDevTools();
  });
  //Handler to delete user history
  ipc.on("deleteWebviewHistory", () => {
    view.clearHistory();
  });
  //workaround for invisible cursor
  view.addEventListener("dom-ready", event => {
    // Remove this once https://github.com/electron/electron/issues/14474 is fixed
    view.blur();

    view.focus();
  });
  const autoComplete = data => {
    if (data === "" || data === null || data === undefined) {
    } else {
      fetch(
        `https://www.google.com/complete/search?output=toolbar&q=${data}`
      ).then(res => {
        res.text().then(data => {
          let parsedXml = $.parseXML(data);
          let suggestions = [];
          parsedXml.querySelectorAll("suggestion").forEach(e => {
            let suggestion = e.getAttribute("data");
            suggestions.push(suggestion);
          });
          createAndPushList(suggestions);
        });
      });
    }
  };
  const createAndPushList = arr => {
    let autocomplete = document.querySelector(".autocomplete");
    autocomplete.innerHTML = "";
    if ($(".search-bar").val() === "") autocomplete.innerHTML = "";
    arr.forEach(text => {
      let sug = document.createElement("div");
      sug.className = "item";
      sug.innerHTML = text;
      sug.addEventListener("click", () => {
        searchBar.value = sug.innerHTML;
        autocomplete.innerHTML = "";
        changePage();
      });
      autocomplete.appendChild(sug);
    });
  };
  const changePage = () => {
    let URL = $(".search-bar").val();
    if (URL.startsWith("http://") || URL.startsWith("https://")) {
      $(".autocomplete")
        .html("")
        .blur();
      view.src = URL;
    } else if (URL.startsWith("//")) {
      $(".autocomplete")
        .html("")
        .blur();
      view.src = decodeURIComponent(
        require("url").format({
          pathname: URL,
          protocol: "http:",
          slashes: true
        })
      );
    } else {
      $(".autocomplete")
        .html("")
        .blur();
      view.src = "http://google.com/search?q=" + URL;
    }
    searchBar.value = view.src;
    $(".autocomplete")
      .html("")
      .blur();
  };
  view.addEventListener("did-start-loading", () => {
    $(".search .loader").show();
    searchBar.value = view.src;
    $(".autocomplete")
      .html("")
      .blur();
  });
  view.addEventListener("did-stop-loading", () => {
    $(".search .loader").hide();
    searchBar.value = view.src;
    $(".autocomplete")
      .html("")
      .blur();
  });
  setInterval(() => {
    if (!view.canGoBack()) {
      back.querySelector("div").style.color = "#888";
    } else {
      back.querySelector("div").style.color = "inherit";
    }
    if (!view.canGoForward()) {
      forward.querySelector("div").style.color = "#888";
    } else {
      forward.querySelector("div").style.color = "inherit";
    }
  }, 1500);

  searchBar.addEventListener("click", () => {
    $(".search-bar").select();
  });
  refresh.addEventListener("click", () => {
    view.reload();
  });
  back.addEventListener("click", () => {
    view.goBack();
  });
  forward.addEventListener("click", () => {
    view.goForward();
  });
  submit.addEventListener("click", () => {
    changePage();
  });
  searchBar.addEventListener("keyup", e => {
    if (
      $(".search-bar")
        .val()
        .startsWith("//") ||
      $(".search-bar")
        .val()
        .startsWith("https://") ||
      $(".search-bar")
        .val()
        .startsWith("http://")
    )
      $(".autocomplete")
        .html("")
        .blur();
    if (e.keyCode === 13) changePage();
  });
  searchBar.addEventListener("keydown", e => {
    if (
      e.keyCode !== 13 &&
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40
    ) {
      if ($(".search-bar").val() === "")
        $(".autocomplete")
          .html("")
          .blur();
      autoComplete($(".search-bar").val());
    }
  });
  function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split("?")[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split("#")[0];

      // split our query string into its component parts
      var arr = queryString.split("&");

      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split("=");

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof a[1] === "undefined" ? true : a[1];

        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === "string")
          paramValue = paramValue.toLowerCase();

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, "");
          if (!obj[key]) obj[key] = [];

          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === "string") {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }

    return obj;
  }
  let urlGoto = getAllUrlParams(window.location.href).goto;
  if (urlGoto) {
    view.src = decodeURIComponent(urlGoto);
  } else {
  }
});
