import Label from './Label'
import './TextInput.css'

export default function TextInput({
  id,
  label,
  required,
  error,
  hint,
  mono = false,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const hasError = Boolean(error)
  const inputClasses = [
    'ds-text-input',
    hasError && 'ds-text-input--error',
    mono && 'ds-text-input--mono',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const wrapperClasses = ['ds-text-input-wrap', wrapperClassName].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      {label && <Label htmlFor={id} required={required}>{label}</Label>}
      <input
        id={id}
        type="text"
        className={inputClasses}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={[error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="ds-text-input-error-msg" role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="ds-text-input-hint">
          {hint}
        </span>
      )}
    </div>
  )
}
