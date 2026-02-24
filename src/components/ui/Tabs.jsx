import './Tabs.css'

export default function Tabs({ tabs, value, onChange, 'aria-label': ariaLabel = 'Tabs' }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="ds-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          aria-controls={`panel-${tab.value}`}
          id={`tab-${tab.value}`}
          tabIndex={value === tab.value ? 0 : -1}
          className="ds-tabs__tab"
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ id, value, activeValue, children }) {
  const isActive = value === activeValue
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className="ds-tabs__panel"
    >
      {children}
    </div>
  )
}
