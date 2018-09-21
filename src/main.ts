import {app, dialog, ipcMain, BrowserWindow} from "electron";
import * as path from "path";

import MainIpc from "./mainIpc";
import {IpcMainWrapper} from "./utilities/ipcMainWrapper";

let mainWindow: Electron.BrowserWindow;

console.log("starting...");
app.on("ready", () => {
    // Create browser window
    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
    });
    mainWindow.loadFile(path.join(__dirname, "views/index.html"));

    // Add event listener for when window is closed
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

app.on("window-all-closed", () => {
    // Quit the program
    app.quit();
});

// IPC /////////////////////////////////////////////////////////////////////
const ipcWrapper = new IpcMainWrapper(ipcMain);

let mainIpc: MainIpc;
mainIpc = new MainIpc(ipcWrapper);
