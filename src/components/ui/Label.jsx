import './Label.css'

export default function Label({ children, htmlFor, required, className = '' }) {
  const classes = ['ds-label', className].filter(Boolean).join(' ')
  return (
    <label className={classes} htmlFor={htmlFor}>
      {children}
      {required && <span className="ds-label__required" aria-hidden="true">*</span>}
    </label>
  )
}
