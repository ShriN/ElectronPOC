'use strict';

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let globalShortcut = electron.globalShortcut;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
        frame: false,
        height: 700,
        resizable: false,
        width: 368
    });
    
  //console.log(mainWindow);  
  
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app/index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  globalShortcut.register('ctrl+shift+1', function () {
      //console.log('ctrl+shift+1 pressed');
            mainWindow.webContents.send('global-shortcut', 0);
    });
    
    globalShortcut.register('ctrl+shift+2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// Close button click subscription.
const {ipcMain} = require('electron');
ipcMain.on('close-main-window', (event, arg) => {
  app.quit();
});

// Setting button click event call
var settingsWindow = null;

ipcMain.on('open-settings-window', (event, arg) => {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });
    
    //console.log(settingsWindow);  

    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

// Setting close button click event call
ipcMain.on('close-settings-window', (event, arg) => {
    if (settingsWindow) {
        settingsWindow.close();
    }
});
