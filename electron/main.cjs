const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const icon = path.join(__dirname, '..', 'build', 'icon.ico');
  const win = new BrowserWindow({
    width: 430,
    height: 860,
    minWidth: 390,
    minHeight: 720,
    title: '拾猫记',
    icon,
    backgroundColor: '#fffaf1',
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, '..', 'app', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
