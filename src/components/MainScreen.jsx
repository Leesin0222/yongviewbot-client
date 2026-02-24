import { useState, useEffect } from 'react'
import { Button, TextInput, useToast } from './ui'
import Mascot from './Mascot'
import MascotMessage from './MascotMessage'

export default function MainScreen({ botRunning, botError }) {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [startError, setStartError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (window.electronAPI?.getWebhookUrl) {
      window.electronAPI.getWebhookUrl().then(setWebhookUrl)
    }
  }, [])

  const start = async () => {
    setStartError(null)
    if (!window.electronAPI?.startBot) return
    const res = await window.electronAPI.startBot()
    if (!res.ok) {
      if (res.error === 'jar_not_found') setStartError('봇 JAR를 찾을 수 없어요. yongviewbot을 빌드한 뒤 다시 시도해 주세요.')
      else if (res.error === 'already_running') setStartError('이미 실행 중이에요.')
      else setStartError(res.error || '시작에 실패했어요.')
    }
  }

  const stop = async () => {
    if (window.electronAPI?.stopBot) await window.electronAPI.stopBot()
  }

  const copyUrl = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl)
      toast('복사했어요!')
    }
  }

  return (
    <div className="ds-mascot-layout">
      <Mascot />
      <div className="ds-mascot-conversation">
        <MascotMessage>
          안녕! 봇을 시작하거나 URL을 복사할 수 있어요.
        </MascotMessage>

        <MascotMessage>
          {botRunning ? '지금 봇이 돌아가고 있어요.' : '지금 봇은 중지된 상태예요.'}
          {botError && (
            <span className="ds-mascot-conversation__error-inline">
              {' '}오류: {botError}
            </span>
          )}
        </MascotMessage>

        {startError && (
          <MascotMessage variant="error" role="alert">
            {startError}
          </MascotMessage>
        )}

        <div className="ds-mascot-actions ds-flex ds-gap-2">
          <Button variant="primary" onClick={start} disabled={botRunning}>
            시작
          </Button>
          <Button variant="secondary" onClick={stop} disabled={!botRunning}>
            종료
          </Button>
        </div>

        <MascotMessage>
          GitLab Webhooks에 넣을 URL이야. 필요하면 복사해 줘.
        </MascotMessage>
        <div className="ds-flex ds-gap-2 ds-items-end">
          <TextInput
            id="webhook-url"
            label="URL"
            value={webhookUrl}
            readOnly
            mono
            wrapperClassName="ds-flex-1"
          />
          <Button variant="secondary" onClick={copyUrl} size="md">
            복사
          </Button>
        </div>

        <MascotMessage>
          Java 17 이상이 필요하고, Ollama는 별도로 실행해 두면 돼요.
        </MascotMessage>
      </div>
    </div>
  )
}
