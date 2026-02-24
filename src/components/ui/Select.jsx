import Label from './Label'
import './Select.css'

export default function Select({
  id,
  label,
  hint,
  options,
  children,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const wrapperClasses = ['ds-select-wrap', wrapperClassName].filter(Boolean).join(' ')
  const selectClasses = ['ds-select', className].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <select id={id} className={selectClasses} {...props}>
        {options != null
          ? options.map((opt) =>
              typeof opt === 'object' && opt !== null ? (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ) : (
                <option key={opt} value={opt}>{opt}</option>
              )
            )
          : children}
      </select>
      {hint && <span className="ds-select-hint">{hint}</span>}
    </div>
  )
}
