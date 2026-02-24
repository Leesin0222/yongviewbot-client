import { useState, useEffect, useCallback } from 'react'
import { Button, TextInput, useToast } from './ui'
import Mascot from './Mascot'
import TypingMessage from './TypingMessage'
import './MainScreen.css'

const PHASE_WELCOME = 'welcome'
const PHASE_RUNNING = 'running'
const PHASE_ERROR = 'error'
const PHASE_STOPPED = 'stopped'

export default function MainScreen({ botRunning, botError, onOpenSettings }) {
  const [phase, setPhase] = useState(PHASE_WELCOME)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [startError, setStartError] = useState(null)
  const [typingDone, setTypingDone] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (window.electronAPI?.getWebhookUrl) {
      window.electronAPI.getWebhookUrl().then(setWebhookUrl)
    }
  }, [])

  useEffect(() => {
    if (botRunning) {
      setPhase(PHASE_RUNNING)
      setStartError(null)
    } else if (phase === PHASE_RUNNING) {
      setPhase(PHASE_STOPPED)
    }
  }, [botRunning, phase])

  const startBot = async () => {
    setStartError(null)
    if (!window.electronAPI?.startBot) return
    const res = await window.electronAPI.startBot()
    if (res.ok) {
      setPhase(PHASE_RUNNING)
    } else {
      setPhase(PHASE_ERROR)
      if (res.error === 'jar_not_found') {
        setStartError('JAR를 못 찾았어. resources/yongviewbot.jar 를 넣어줘, 삐-뷰.')
      } else if (res.error === 'already_running') {
        setStartError('이미 돌아가고 있어. 삐-뷰.')
      } else {
        setStartError(res.error || '시작이 안 됐어. 다시 해줘, 삐-뷰.')
      }
    }
  }

  const stopBot = async () => {
    if (window.electronAPI?.stopBot) await window.electronAPI.stopBot()
    setPhase(PHASE_STOPPED)
  }

  const copyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl)
      toast('복사했어, 삐-뷰!')
    }
  }

  const goSettings = () => {
    if (typeof onOpenSettings === 'function') onOpenSettings()
  }

  const handleTypingComplete = useCallback(() => setTypingDone(true), [])

  // ——— 용뷰봇 말투: ~다, 삐-뷰, 캐주얼 ———
  const getMessage = () => {
    if (phase === PHASE_WELCOME) {
      return '안녕, 나는 용뷰봇이다. 삐-뷰. 봇 켜줄까? 아니면 설정부터 볼래?'
    }
    if (phase === PHASE_RUNNING) {
      return botError
        ? `돌아가긴 하는데 오류가 났어. ${botError} 삐-뷰.`
        : '잘 돌아가고 있다. 삐-뷰. 아래 URL을 GitLab Webhook에 박아줘.'
    }
    if (phase === PHASE_ERROR) {
      return startError || '뭔가 잘못됐어. 다시 해볼래? 삐-뷰.'
    }
    if (phase === PHASE_STOPPED) {
      return '봇 끄고 왔다. 다시 켤까? 삐-뷰.'
    }
    return ''
  }

  const getChoices = () => {
    if (phase === PHASE_WELCOME) {
      return [
        { id: 'start', label: '봇 켜줄게', onClick: startBot },
        { id: 'settings', label: '설정 먼저 볼게', onClick: goSettings },
      ]
    }
    if (phase === PHASE_RUNNING) {
      return [
        { id: 'settings', label: '설정 가기', onClick: goSettings },
        { id: 'stop', label: '봇 끌게', onClick: stopBot, variant: 'secondary' },
      ]
    }
    if (phase === PHASE_ERROR) {
      return [
        { id: 'retry', label: '다시 해볼게', onClick: startBot },
        { id: 'settings', label: '설정 가기', onClick: goSettings },
      ]
    }
    if (phase === PHASE_STOPPED) {
      return [
        { id: 'start', label: '봇 다시 켤게', onClick: startBot },
        { id: 'settings', label: '설정 볼게', onClick: goSettings },
      ]
    }
    return []
  }

  const messageText = getMessage()
  const messageVariant = phase === PHASE_ERROR ? 'error' : 'default'
  const choices = getChoices()

  // 메시지가 바뀌면 타이핑 다시 시작 → 완료 전까지 선택지 숨김
  useEffect(() => {
    setTypingDone(false)
  }, [messageText])

  return (
    <div className="ds-mascot-layout ds-mascot-layout--vn">
      <Mascot />
      <div className="ds-mascot-conversation ds-mascot-conversation--vn">
        <TypingMessage
          key={messageText}
          text={messageText}
          variant={messageVariant}
          role="status"
          className="ds-mascot-bubble--current"
          onComplete={handleTypingComplete}
        />

        {phase === PHASE_RUNNING && webhookUrl && (
          <div className="ds-mascot-vn-url">
            <TextInput
              id="webhook-url"
              label="Webhook URL"
              value={webhookUrl}
              readOnly
              mono
              wrapperClassName="ds-flex-1"
            />
            <Button variant="secondary" onClick={copyUrl} size="md">
              복사
            </Button>
          </div>
        )}

        {typingDone && (
          <div className="ds-mascot-choices" role="group" aria-label="선택지">
            {choices.map((c) => (
              <Button
                key={c.id}
                variant={c.variant || 'primary'}
                onClick={c.onClick}
                className="ds-mascot-choice-btn"
              >
                {c.label}
              </Button>
            ))}
          </div>
        )}

        <p className="ds-mascot-hint">
          Java 17 이상 필요하고, Ollama는 따로 켜둬. 삐-뷰.
        </p>
      </div>
    </div>
  )
}
