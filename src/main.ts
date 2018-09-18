import {app, BrowserWindow} from "electron";
import * as path from "path";

let mainWindow: Electron.BrowserWindow;

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
