import { Truck } from 'lucide-react'

export default function Sidebar({ title, subtitle, items, footer }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo"><Truck size={16} /></div>
        <div>
          <div className="sidebar-title">{title}</div>
          <div className="sidebar-sub">{subtitle}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${item.active ? ' active' : ''}`}
            onClick={item.onClick}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {footer && <div className="sidebar-footer">{footer}</div>}
    </aside>
  )
}
