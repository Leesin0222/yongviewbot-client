/**
 * 타이핑 효과가 있는 말풍선. 텍스트가 한 글자씩 출력되고, 완료 시 onComplete 호출.
 * prefers-reduced-motion 이면 즉시 전체 표시.
 */
import { useState, useEffect, useRef } from 'react'
import MascotMessage from './MascotMessage'
import './TypingMessage.css'

const CHAR_DELAY_MS = 45
const PUNCTUATION_DELAY_MS = 120

export default function TypingMessage({
  text = '',
  variant = 'default',
  className = '',
  role = 'status',
  onComplete,
  speed = 1,
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      setDone(true)
      onCompleteRef.current?.()
      return
    }

    if (prefersReducedMotion) {
      setDisplayed(text)
      setDone(true)
      onCompleteRef.current?.()
      return
    }

    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    const delay = (ms) => new Promise((r) => setTimeout(r, ms / speed))
    const isPunct = (c) => /[.!?~,]\s*$/.test(c)

    let cancelled = false
    ;(async () => {
      for (let i = 0; i <= text.length && !cancelled; i++) {
        setDisplayed(text.slice(0, i))
        indexRef.current = i
        if (i >= text.length) break
        const char = text[i]
        const next = text[i + 1]
        const ms = isPunct(char) || (next === ' ' && isPunct(text[i - 1])) ? PUNCTUATION_DELAY_MS : CHAR_DELAY_MS
        await delay(ms)
      }
      if (!cancelled) {
        setDone(true)
        onCompleteRef.current?.()
      }
    })()

    return () => { cancelled = true }
  }, [text, prefersReducedMotion, speed])

  return (
    <MascotMessage variant={variant} className={`ds-mascot-bubble--typing ${className}`.trim()} role={role}>
      <span className="ds-typing-text">{displayed}</span>
      {!done && !prefersReducedMotion && <span className="ds-typing-cursor" aria-hidden="true" />}
    </MascotMessage>
  )
}
