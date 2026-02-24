import { useState, useEffect } from 'react'
import { Button, TextInput, Select, useToast } from './ui'

const THEME_KEY = 'yongviewbot-theme'

const defaultConfig = {
  gitlabUrl: '',
  gitlabPrivateToken: '',
  webhookSecret: '',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.1:8b',
  reviewMode: 'single',
  serverPort: '8000',
}

export default function Settings() {
  const [config, setConfig] = useState(defaultConfig)
  const { toast } = useToast()
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') || 'light'
  })

  useEffect(() => {
    if (window.electronAPI?.getConfig) {
      window.electronAPI.getConfig().then((c) => setConfig({ ...defaultConfig, ...c }))
    }
  }, [])

  const handleThemeChange = (e) => {
    const value = e.target.value
    if (value !== 'light' && value !== 'dark') return
    setTheme(value)
    document.documentElement.setAttribute('data-theme', value)
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch (_) {}
  }

  const handleSave = async () => {
    if (!window.electronAPI?.saveConfig) return
    await window.electronAPI.saveConfig(config)
    toast('저장했어요!', { variant: 'success' })
  }

  const update = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="ds-max-w-form ds-flex ds-flex-col ds-gap-4">
      <section aria-labelledby="settings-appearance-heading">
        <h2 id="settings-appearance-heading" className="ds-section-title">
          외관
        </h2>
        <Select
          id="theme"
          label="테마"
          value={theme}
          onChange={handleThemeChange}
          hint="앱 전체 색상 테마를 선택합니다."
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>
      </section>

      <section aria-labelledby="settings-gitlab-heading">
        <h2 id="settings-gitlab-heading" className="ds-section-title">
          GitLab
        </h2>
        <div className="ds-flex ds-flex-col ds-gap-3">
          <TextInput
            id="gitlab-url"
            label="GitLab URL (필수)"
            required
            value={config.gitlabUrl}
            onChange={(e) => update('gitlabUrl', e.target.value)}
            placeholder="https://gitlab.example.com"
          />
          <TextInput
            id="gitlab-token"
            label="GitLab Private Token (필수)"
            required
            value={config.gitlabPrivateToken}
            onChange={(e) => update('gitlabPrivateToken', e.target.value)}
            placeholder="glpat-xxxxxxxx"
          />
        </div>
      </section>

      <section aria-labelledby="settings-webhook-heading">
        <h2 id="settings-webhook-heading" className="ds-section-title">
          Webhook
        </h2>
        <TextInput
          id="webhook-secret"
          label="Webhook Secret (선택)"
          value={config.webhookSecret}
          onChange={(e) => update('webhookSecret', e.target.value)}
        />
      </section>

      <section aria-labelledby="settings-ollama-heading">
        <h2 id="settings-ollama-heading" className="ds-section-title">
          Ollama
        </h2>
        <div className="ds-flex ds-flex-col ds-gap-3">
          <TextInput
            id="ollama-base-url"
            label="Ollama Base URL"
            value={config.ollamaBaseUrl}
            onChange={(e) => update('ollamaBaseUrl', e.target.value)}
          />
          <TextInput
            id="ollama-model"
            label="Ollama Model"
            value={config.ollamaModel}
            onChange={(e) => update('ollamaModel', e.target.value)}
            placeholder="llama3.1:8b"
          />
        </div>
      </section>

      <section aria-labelledby="settings-server-heading">
        <h2 id="settings-server-heading" className="ds-section-title">
          서버
        </h2>
        <div className="ds-flex ds-flex-col ds-gap-3">
          <Select
            id="review-mode"
            label="Review Mode"
            value={config.reviewMode}
            onChange={(e) => update('reviewMode', e.target.value)}
          >
            <option value="single">single (MR 노트 한 개)</option>
            <option value="line">line (라인별 스레드)</option>
          </Select>
          <TextInput
            id="server-port"
            label="Server Port"
            value={config.serverPort}
            onChange={(e) => update('serverPort', e.target.value)}
          />
        </div>
      </section>

      <div className="ds-flex ds-gap-2 ds-items-center ds-mt-4">
        <Button variant="primary" type="button" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  )
}
