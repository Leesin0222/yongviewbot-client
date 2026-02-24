import './Button.css'

const variantClass = {
  primary: 'ds-btn--primary',
  secondary: 'ds-btn--secondary',
  ghost: 'ds-btn--ghost',
  danger: 'ds-btn--danger',
}

const sizeClass = {
  sm: 'ds-btn--sm',
  md: 'ds-btn--md',
  lg: 'ds-btn--lg',
}

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'ds-btn',
    variantClass[variant] || variantClass.secondary,
    sizeClass[size] || sizeClass.md,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
