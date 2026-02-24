/**
 * 마스코트 캐릭터 영역.
 * 이미지는 public/mascot.png 에 두거나, src prop으로 경로 지정.
 * 이미지가 없거나 로드 실패 시 placeholder 표시.
 */
import { useState } from 'react'
import './Mascot.css'

const DEFAULT_MASCOT_SRC = '/mascot.png'

export default function Mascot({ src = DEFAULT_MASCOT_SRC, alt = '' }) {
  const [errored, setErrored] = useState(false)
  const showPlaceholder = errored

  return (
    <div className="ds-mascot" aria-hidden="true">
      {!showPlaceholder && (
        <img
          className="ds-mascot__img"
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
        />
      )}
      {showPlaceholder && (
        <div className="ds-mascot__placeholder" aria-hidden="true">
          마스코트
        </div>
      )}
    </div>
  )
}
