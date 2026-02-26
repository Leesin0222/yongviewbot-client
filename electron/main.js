const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const os = require('os')

const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json')
const WINDOW_STATE_FILE = path.join(app.getPath('userData'), 'window-state.json')
let mainWindow = null
let botProcess = null

const defaultConfig = {
  gitlabUrl: '',
  gitlabPrivateToken: '',
  webhookSecret: '',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.1:8b',
  reviewTriggerActions: 'open',
  serverPort: '8000',
}

function loadWindowState() {
  try {
    const raw = fs.readFileSync(WINDOW_STATE_FILE, 'utf8')
    const state = JSON.parse(raw)
    const { width, height, x, y } = state
    if (width > 0 && height > 0) return state
  } catch {}
  return null
}

function saveWindowState() {
  if (!mainWindow || mainWindow.isDestroyed()) return
  const bounds = mainWindow.getBounds()
  try {
    fs.writeFileSync(
      WINDOW_STATE_FILE,
      JSON.stringify({
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
      }),
      'utf8'
    )
  } catch {}
}

function getJarPath() {
  if (app.isPackaged) {
    const jarPath = path.join(process.resourcesPath, 'yongviewbot.jar')
    return fs.existsSync(jarPath) ? jarPath : null
  }
  const jarPath = path.join(__dirname, '..', 'resources', 'yongviewbot.jar')
  return fs.existsSync(jarPath) ? jarPath : null
}

function getLocalIp() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return '127.0.0.1'
}

function createApplicationMenu() {
  const isMac = process.platform === 'darwin'
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: isMac ? 'File' : '파일',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: isMac ? 'Edit' : '편집',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [{ role: 'selectAll' }, { type: 'separator' }, { role: 'speech' }] : [{ role: 'selectAll' }]),
      ],
    },
    {
      label: isMac ? 'View' : '보기',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: isMac ? 'Window' : '창',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : [{ role: 'close' }]),
      ],
    },
    {
      label: isMac ? 'Help' : '도움말',
      submenu: [{ role: 'about' }],
    },
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  const windowState = loadWindowState()
  const winOpts = {
    minWidth: 400,
    minHeight: 400,
    width: windowState?.width ?? 700,
    height: windowState?.height ?? 560,
    x: windowState?.x,
    y: windowState?.y,
    show: false,
    backgroundColor: '#F5F6F8',
    title: 'Yongviewbot Client',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  }
  mainWindow = new BrowserWindow(winOpts)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('close', () => {
    saveWindowState()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.setName('Yongviewbot Client')

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
  process.exit(0)
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.whenReady().then(() => {
  createApplicationMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (botProcess) {
    botProcess.kill()
    botProcess = null
  }
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('getConfig', () => {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8')
    return { ...defaultConfig, ...JSON.parse(raw) }
  } catch {
    return defaultConfig
  }
})

ipcMain.handle('saveConfig', (_, config) => {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8')
  return true
})

ipcMain.handle('startBot', () => {
  if (botProcess) return { ok: false, error: 'already_running' }
  const jarPath = getJarPath()
  if (!jarPath) return { ok: false, error: 'jar_not_found' }
  const config = (() => {
    try {
      return { ...defaultConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) }
    } catch { return defaultConfig }
  })()
  const env = {
    ...process.env,
    GITLAB_URL: config.gitlabUrl || '',
    GITLAB_PRIVATE_TOKEN: config.gitlabPrivateToken || '',
    WEBHOOK_SECRET: config.webhookSecret || '',
    OLLAMA_BASE_URL: config.ollamaBaseUrl || 'http://localhost:11434',
    OLLAMA_MODEL: config.ollamaModel || 'llama3.1:8b',
    REVIEW_TRIGGER_ACTIONS: config.reviewTriggerActions ?? 'open',
    SERVER_PORT: config.serverPort || '8000',
  }
  try {
    botProcess = spawn('java', ['-jar', jarPath], { env })
    botProcess.on('error', (err) => {
      mainWindow?.webContents.send('bot-status', { running: false, error: err.message })
    })
    botProcess.on('exit', (code) => {
      botProcess = null
      mainWindow?.webContents.send('bot-status', { running: false, exitCode: code })
    })
    mainWindow?.webContents.send('bot-status', { running: true })
    return { ok: true }
  } catch (err) {
    botProcess = null
    return { ok: false, error: err.message }
  }
})

ipcMain.handle('stopBot', () => {
  if (!botProcess) return { ok: true }
  botProcess.kill()
  botProcess = null
  mainWindow?.webContents.send('bot-status', { running: false })
  return { ok: true }
})

ipcMain.handle('getWebhookUrl', () => {
  let config = defaultConfig
  try {
    config = { ...defaultConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) }
  } catch {}
  const port = config.serverPort || '8000'
  const ip = getLocalIp()
  return `http://${ip}:${port}/webhook`
})
