const dialogs = require("dialogs")()
function initPrompt(text){
    return new Promise((resolve, reject) => {
      dialogs.prompt(text , val => {resolve(val)})
    })
}
function prompt(text){
  let returns;
  this.returnIt = (a) => {
    return a;
  }
    initPrompt(text).then(answer => {this.returnIt(answer)})
}
prompt("Hello World")