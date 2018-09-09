import * as path from 'path';
import {app, BrowserWindow} from 'electron';

let mainWindow: Electron.BrowserWindow;

app.on("ready", () => {
    // Create browser window
    mainWindow = new BrowserWindow({
        height: 600,
        width:800
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Add event listener for when window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    // Quit the program
    app.quit();
});
