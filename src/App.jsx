import { useState, useEffect } from 'react'
import { Tabs, TabPanel, ToastProvider } from './components/ui'
import MainScreen from './components/MainScreen'
import Settings from './components/Settings'

const TAB_MAIN = 'main'
const TAB_SETTINGS = 'settings'

export default function App() {
  const [view, setView] = useState(TAB_MAIN)
  const [botRunning, setBotRunning] = useState(false)
  const [botError, setBotError] = useState(null)

  useEffect(() => {
    if (!window.electronAPI?.onBotStatus) return
    window.electronAPI.onBotStatus((status) => {
      setBotRunning(!!status.running)
      setBotError(status.error || null)
    })
  }, [])

  const tabs = [
    { value: TAB_MAIN, label: '메인' },
    { value: TAB_SETTINGS, label: '설정' },
  ]

  return (
    <ToastProvider>
      <div className="ds-app">
        <header className="ds-app-header" role="banner">
        <h1 className="ds-type-display ds-m-0">
          Yongviewbot
        </h1>
        <Tabs
          tabs={tabs}
          value={view}
          onChange={setView}
          aria-label="메인 내비게이션"
        />
      </header>
      <main className="ds-app-main" id="main-content" role="main">
        <TabPanel id="panel-main" value={TAB_MAIN} activeValue={view}>
          <MainScreen botRunning={botRunning} botError={botError} />
        </TabPanel>
        <TabPanel id="panel-settings" value={TAB_SETTINGS} activeValue={view}>
          <Settings />
        </TabPanel>
      </main>
      </div>
    </ToastProvider>
  )
}
