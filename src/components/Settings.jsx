import { useState, useEffect, useCallback } from 'react'
import { Button, Label, TextInput, Select, useToast } from './ui'
import Mascot from './Mascot'
import TypingMessage from './TypingMessage'
import './Settings.css'

const THEME_KEY = 'yongviewbot-theme'

const defaultConfig = {
  gitlabUrl: '',
  gitlabPrivateToken: '',
  githubToken: '',
  webhookSecret: '',
  ollamaBaseUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.1:8b',
  llmProvider: 'ollama',
  llmApiKey: '',
  llmModel: 'gpt-4o',
  llmBaseUrl: 'https://api.openai.com/v1',
  reviewTriggerActions: 'open',
  serverPort: '8000',
  startServerOnLaunch: false,
}

const SETTINGS_STEPS = [
  { id: 'gitlabUrl', message: 'GitLab URL 알려줘. 예: https://gitlab.example.com 삐-뷰.', key: 'gitlabUrl', label: 'GitLab URL', required: true, type: 'text', placeholder: 'https://gitlab.example.com' },
  { id: 'gitlabToken', message: 'Private Token 알려줘. glpat-xxxx 같은 거. 삐-뷰.', key: 'gitlabPrivateToken', label: 'Private Token', required: true, type: 'text', placeholder: 'glpat-xxxxxxxx' },
  { id: 'webhookSecret', message: 'Webhook Secret 쓸 거면 알려줘. 안 쓰면 건너뛰어도 돼. 삐-뷰.', key: 'webhookSecret', label: 'Webhook Secret (선택)', required: false, type: 'text', canSkip: true },
  { id: 'ollamaUrl', message: 'Ollama 주소 알려줘. 기본은 http://localhost:11434 삐-뷰.', key: 'ollamaBaseUrl', label: 'Ollama Base URL', required: false, type: 'text' },
  { id: 'ollamaModel', message: 'Ollama 모델 이름 알려줘. 예: llama3.1:8b 삐-뷰.', key: 'ollamaModel', label: 'Ollama Model', required: false, type: 'text', placeholder: 'llama3.1:8b' },
  { id: 'reviewTriggerActions', message: '리뷰 트리거 알려줘. open이면 MR 최초 오픈 시만, open,update,reopen이면 오픈·수정·다시 열기 시. 삐-뷰.', key: 'reviewTriggerActions', label: '리뷰 트리거 (action)', required: false, type: 'text', placeholder: 'open 또는 open,update,reopen' },
  { id: 'serverPort', message: '봇이 받을 포트 번호 알려줘. 기본 8000 삐-뷰.', key: 'serverPort', label: 'Server Port', required: false, type: 'text' },
  { id: 'theme', message: '밝게 할까? 어둡게 할까? 삐-뷰.', key: 'theme', label: '테마', required: false, type: 'theme' },
]

const CHOOSE_MESSAGE = '설정을 대화로 하나씩 채울까? 아니면 설정 화면에서 한 번에 볼까? 삐-뷰.'
const DONE_MESSAGE = '다 적었어. 저장할까? 삐-뷰.'
const SAVED_MESSAGE = '저장했어. 삐-뷰.'

export default function Settings() {
  const [mode, setMode] = useState('choose')
  const [stepIndex, setStepIndex] = useState(0)
  const [config, setConfig] = useState(defaultConfig)
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') || 'light'
  })
  const [saveError, setSaveError] = useState(null)
  const [typingDone, setTypingDone] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (window.electronAPI?.getConfig) {
      window.electronAPI.getConfig().then((c) => setConfig({ ...defaultConfig, ...c }))
    }
  }, [])

  const applyTheme = useCallback((value) => {
    if (value !== 'light' && value !== 'dark') return
    setTheme(value)
    document.documentElement.setAttribute('data-theme', value)
    try { localStorage.setItem(THEME_KEY, value) } catch (_) {}
  }, [])

  const update = (key, value) => {
    if (key === 'theme') applyTheme(value)
    else setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleChooseConversation = () => {
    setMode('conversation')
    setStepIndex(0)
    setSaveError(null)
    setJustSaved(false)
    setTypingDone(false)
  }

  const handleChooseFull = () => setMode('full')

  const handleNext = () => {
    if (stepIndex < SETTINGS_STEPS.length) setStepIndex((i) => i + 1)
    setTypingDone(false)
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleSaveFromConversation = async () => {
    setSaveError(null)
    if (!config.gitlabUrl?.trim()) {
      setSaveError('GitLab URL이 비어 있어. 다시 채울까? 설정 화면에서 할까?')
      return
    }
    if (!config.gitlabPrivateToken?.trim()) {
      setSaveError('Private Token이 비어 있어. 다시 채울까? 설정 화면에서 할까?')
      return
    }
    if (!window.electronAPI?.saveConfig) return
    await window.electronAPI.saveConfig(config)
    try { localStorage.setItem(THEME_KEY, theme) } catch (_) {}
    toast('저장했어, 삐-뷰!', { variant: 'success' })
    setJustSaved(true)
  }

  const handleSaveFromFull = async () => {
    if (!window.electronAPI?.saveConfig) return
    await window.electronAPI.saveConfig(config)
    try { localStorage.setItem(THEME_KEY, theme) } catch (_) {}
    toast('저장했어, 삐-뷰!', { variant: 'success' })
  }

  const handleRedoConversation = () => {
    setSaveError(null)
    setStepIndex(0)
    setTypingDone(false)
  }

  const handleShowFullAfterError = () => {
    setSaveError(null)
    setMode('full')
  }

  const handleShowFullAfterSaved = () => {
    setJustSaved(false)
    setMode('full')
  }

  const handleStartOver = () => {
    setJustSaved(false)
    setStepIndex(0)
    setTypingDone(false)
  }

  const handleConversationFromFull = () => {
    setMode('choose')
    setTypingDone(false)
  }

  // ——— 대화형: 선택 화면 ———
  if (mode === 'choose') {
    return (
      <div className="ds-settings-vn ds-mascot-layout ds-mascot-layout--vn">
        <Mascot />
        <div className="ds-mascot-conversation ds-mascot-conversation--vn ds-settings-conversation">
          <TypingMessage
            key="choose"
            text={CHOOSE_MESSAGE}
            className="ds-mascot-bubble--current"
            onComplete={() => setTypingDone(true)}
          />
          {typingDone && (
            <div className="ds-mascot-choices" role="group" aria-label="선택지">
              <Button variant="primary" className="ds-mascot-choice-btn" onClick={handleChooseConversation}>
                하나씩 채울게
              </Button>
              <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleChooseFull}>
                설정 화면 볼게
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ——— 대화형: 단계별 입력 ———
  if (mode === 'conversation') {
    const atDoneStep = stepIndex >= SETTINGS_STEPS.length
    const isSaveError = !!saveError
    const isJustSaved = !!justSaved

    if (isJustSaved) {
      return (
        <div className="ds-settings-vn ds-mascot-layout ds-mascot-layout--vn">
          <Mascot />
          <div className="ds-mascot-conversation ds-mascot-conversation--vn ds-settings-conversation">
            <TypingMessage key="saved" text={SAVED_MESSAGE} className="ds-mascot-bubble--current" />
            <div className="ds-mascot-choices" role="group" aria-label="선택지">
              <Button variant="primary" className="ds-mascot-choice-btn" onClick={handleShowFullAfterSaved}>
                설정 화면 볼게
              </Button>
              <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleStartOver}>
                처음부터 다시 할게
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (isSaveError) {
      return (
        <div className="ds-settings-vn ds-mascot-layout ds-mascot-layout--vn">
          <Mascot />
          <div className="ds-mascot-conversation ds-mascot-conversation--vn ds-settings-conversation">
            <TypingMessage key="error" text={saveError} variant="error" className="ds-mascot-bubble--current" />
            <div className="ds-mascot-choices" role="group" aria-label="선택지">
              <Button variant="primary" className="ds-mascot-choice-btn" onClick={handleRedoConversation}>
                다시 채울게
              </Button>
              <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleShowFullAfterError}>
                설정 화면 볼게
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (atDoneStep) {
      return (
        <div className="ds-settings-vn ds-mascot-layout ds-mascot-layout--vn">
          <Mascot />
          <div className="ds-mascot-conversation ds-mascot-conversation--vn ds-settings-conversation">
            <TypingMessage
              key="done"
              text={DONE_MESSAGE}
              className="ds-mascot-bubble--current"
              onComplete={() => setTypingDone(true)}
            />
            {typingDone && (
              <div className="ds-mascot-choices" role="group" aria-label="선택지">
                <Button variant="primary" className="ds-mascot-choice-btn" onClick={handleSaveFromConversation}>
                  저장할게
                </Button>
                <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleChooseFull}>
                  설정 화면 볼게
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    const step = SETTINGS_STEPS[stepIndex]
    const value = step.key === 'theme' ? theme : config[step.key]
    const canSkip = step.canSkip === true

    return (
      <div className="ds-settings-vn ds-mascot-layout ds-mascot-layout--vn">
        <Mascot />
        <div className="ds-mascot-conversation ds-mascot-conversation--vn ds-settings-conversation">
          <TypingMessage
            key={step.id}
            text={step.message}
            className="ds-mascot-bubble--current"
            onComplete={() => setTypingDone(true)}
          />
          {typingDone && (
            <>
              <div className="ds-settings-step-field">
                {step.type === 'text' && (
                  <TextInput
                    id={`setting-${step.id}`}
                    label={step.label}
                    value={value || ''}
                    onChange={(e) => update(step.key, e.target.value)}
                    placeholder={step.placeholder}
                  />
                )}
                {step.type === 'select' && (
                  <Select
                    id={`setting-${step.id}`}
                    label={step.label}
                    value={value || step.options?.[0]?.value}
                    onChange={(e) => update(step.key, e.target.value)}
                  >
                    {(step.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                )}
                {step.type === 'theme' && (
                  <Select
                    id="setting-theme"
                    label={step.label}
                    value={theme}
                    onChange={(e) => update('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Select>
                )}
              </div>
              <div className="ds-mascot-choices" role="group" aria-label="선택지">
                <Button variant="primary" className="ds-mascot-choice-btn" onClick={handleNext}>
                  다음
                </Button>
                {canSkip && (
                  <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleSkip}>
                    건너뛸게
                  </Button>
                )}
                <Button variant="secondary" className="ds-mascot-choice-btn" onClick={handleChooseFull}>
                  설정 화면 볼게
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ——— 전체 설정 화면 (기존 폼) ———
  return (
    <div className="ds-settings-full">
      <div className="ds-settings-full-actions">
        <Button variant="secondary" onClick={handleConversationFromFull}>
          대화로 하나씩 채우기
        </Button>
      </div>
      <div className="ds-max-w-form ds-flex ds-flex-col ds-gap-4">
        <section aria-labelledby="settings-gitlab-heading">
          <h2 id="settings-gitlab-heading" className="ds-section-title">GitLab</h2>
          <div className="ds-flex ds-flex-col ds-gap-3">
            <TextInput id="gitlab-url" label="GitLab URL (필수)" required value={config.gitlabUrl} onChange={(e) => setConfig((p) => ({ ...p, gitlabUrl: e.target.value }))} placeholder="https://gitlab.example.com" />
            <TextInput id="gitlab-token" label="GitLab Private Token (필수)" required value={config.gitlabPrivateToken} onChange={(e) => setConfig((p) => ({ ...p, gitlabPrivateToken: e.target.value }))} placeholder="glpat-xxxxxxxx" />
          </div>
        </section>
        <section aria-labelledby="settings-github-heading">
          <h2 id="settings-github-heading" className="ds-section-title">GitHub (선택)</h2>
          <div className="ds-flex ds-flex-col ds-gap-3">
            <TextInput id="github-token" label="GitHub Token (PR 리뷰용, 선택)" value={config.githubToken ?? ''} onChange={(e) => setConfig((p) => ({ ...p, githubToken: e.target.value }))} placeholder="ghp_xxxxxxxx" />
          </div>
        </section>
        <section aria-labelledby="settings-webhook-heading">
          <h2 id="settings-webhook-heading" className="ds-section-title">Webhook</h2>
          <TextInput id="webhook-secret" label="Webhook Secret (선택)" value={config.webhookSecret} onChange={(e) => setConfig((p) => ({ ...p, webhookSecret: e.target.value }))} />
        </section>
        <section aria-labelledby="settings-llm-heading">
          <h2 id="settings-llm-heading" className="ds-section-title">LLM</h2>
          <div className="ds-flex ds-flex-col ds-gap-3">
            <div>
              <Label htmlFor="llm-provider">Provider</Label>
              <Select id="llm-provider" value={config.llmProvider ?? 'ollama'} onChange={(e) => setConfig((p) => ({ ...p, llmProvider: e.target.value }))}>
                <option value="ollama">Ollama (로컬)</option>
                <option value="openai">OpenAI / 호환 API</option>
              </Select>
            </div>
            {config.llmProvider === 'openai' && (
              <>
                <TextInput id="llm-api-key" label="API Key (상용 API 사용 시 과금될 수 있음)" type="password" value={config.llmApiKey ?? ''} onChange={(e) => setConfig((p) => ({ ...p, llmApiKey: e.target.value }))} placeholder="sk-..." />
                <TextInput id="llm-model" label="Model" value={config.llmModel ?? 'gpt-4o'} onChange={(e) => setConfig((p) => ({ ...p, llmModel: e.target.value }))} placeholder="gpt-4o" />
                <TextInput id="llm-base-url" label="Base URL (선택)" value={config.llmBaseUrl ?? 'https://api.openai.com/v1'} onChange={(e) => setConfig((p) => ({ ...p, llmBaseUrl: e.target.value }))} placeholder="https://api.openai.com/v1" />
              </>
            )}
            {config.llmProvider !== 'openai' && (
              <>
                <TextInput id="ollama-base-url" label="Ollama Base URL" value={config.ollamaBaseUrl} onChange={(e) => setConfig((p) => ({ ...p, ollamaBaseUrl: e.target.value }))} />
                <TextInput id="ollama-model" label="Ollama Model" value={config.ollamaModel} onChange={(e) => setConfig((p) => ({ ...p, ollamaModel: e.target.value }))} placeholder="llama3.1:8b" />
              </>
            )}
          </div>
        </section>
        <section aria-labelledby="settings-server-heading">
          <h2 id="settings-server-heading" className="ds-section-title">서버</h2>
          <div className="ds-flex ds-flex-col ds-gap-3">
            <div className="ds-flex ds-items-center ds-gap-2">
              <input
                type="checkbox"
                id="start-server-on-launch"
                checked={config.startServerOnLaunch === true}
                onChange={(e) => setConfig((p) => ({ ...p, startServerOnLaunch: e.target.checked }))}
                className="ds-checkbox"
              />
              <Label htmlFor="start-server-on-launch">앱 실행 시 서버 자동 실행</Label>
            </div>
            <TextInput id="review-trigger-actions" label="리뷰 트리거 (MR 웹훅 action)" value={config.reviewTriggerActions} onChange={(e) => setConfig((p) => ({ ...p, reviewTriggerActions: e.target.value }))} placeholder="open 또는 open,update,reopen" />
            <TextInput id="server-port" label="Server Port" value={config.serverPort} onChange={(e) => setConfig((p) => ({ ...p, serverPort: e.target.value }))} />
          </div>
        </section>
        <section aria-labelledby="settings-appearance-heading">
          <h2 id="settings-appearance-heading" className="ds-section-title">외관</h2>
          <Select id="theme" label="테마" value={theme} onChange={(e) => applyTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </section>
        <div className="ds-flex ds-gap-2 ds-items-center ds-mt-4">
          <Button variant="primary" type="button" onClick={handleSaveFromFull}>저장</Button>
        </div>
      </div>
    </div>
  )
}
