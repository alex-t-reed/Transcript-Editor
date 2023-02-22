const { app, BrowserWindow, Tray } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        title: "Transcript Editor",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('../index.html')

    const iconPath = path.join(__dirname, '../favicon.png');
    console.log(iconPath)
    app.dock.setIcon(iconPath);
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
