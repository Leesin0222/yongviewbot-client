const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('getConfig'),
  saveConfig: (config) => ipcRenderer.invoke('saveConfig', config),
  startBot: () => ipcRenderer.invoke('startBot'),
  stopBot: () => ipcRenderer.invoke('stopBot'),
  onBotStatus: (callback) => {
    ipcRenderer.on('bot-status', (_, status) => callback(status))
  },
  getWebhookUrl: () => ipcRenderer.invoke('getWebhookUrl'),
})
