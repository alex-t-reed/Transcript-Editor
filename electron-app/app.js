const { app, BrowserWindow, Tray } = require('electron')
const path = require('path')
var electron_notarize = require('electron-notarize');


let tray = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 1000,
        title: "Transcript Editor",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    // Set the application icon in the dock (macOS only)
    if (process.platform === 'darwin') {
        const iconPath = path.join(__dirname, 'favicon.png');
        app.dock.setIcon(iconPath);
    }

    // Set the application icon in the system tray
    tray = new Tray(path.join(__dirname, 'favicon.png'));

    tray.setToolTip('Transcript Editor');
    tray.on('click', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


module.exports = async function (params) {
    // Only notarize the app on Mac OS only.
    if (process.platform !== 'darwin') {
        return;
    }
    console.log('afterSign hook triggered', params);

    // Same appId in electron-builder.
    let appId = '<Change this to your appId ad defined in your electron-builder config>'

    let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    console.log(`Notarizing ${appId} found at ${appPath}`);

    try {
        await electron_notarize.notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: process.env.appleId,
            appleIdPassword: process.env.appleIdPassword,
        });
    } catch (error) {
        console.error(error);
    }

    console.log(`Done notarizing ${appId}`);
};