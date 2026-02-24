/**
 * 마스코트 말풍선. 대화형 UI용 (DS §2.1).
 * variant: 'default' | 'error' | 'success'
 */
import './MascotMessage.css'

export default function MascotMessage({ children, className = '', variant = 'default', role = 'status' }) {
  const variantClass = variant !== 'default' ? `ds-mascot-bubble--${variant}` : ''
  return (
    <div className={`ds-mascot-bubble ${variantClass} ${className}`.trim()} role={role}>
      {children}
    </div>
  )
}
