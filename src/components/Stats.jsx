import { Truck, FileText, Gauge, Fuel } from 'lucide-react'
import { hmTotalOf } from '../services/storage'

export default function Stats({ equipment, reports }) {
  const totalHm = reports.reduce((sum, r) => sum + (hmTotalOf(r) || 0), 0)
  const totalFuel = reports.reduce((sum, r) => sum + (Number(r.fuelLiters) || 0), 0)

  const items = [
    { icon: <Truck size={19} />, label: 'Unit Disewa', value: equipment.length },
    { icon: <FileText size={19} />, label: 'Total Laporan', value: reports.length },
    { icon: <Gauge size={19} />, label: 'Total HM', value: `${totalHm.toLocaleString('id-ID')} HM` },
    { icon: <Fuel size={19} />, label: 'Total BBM', value: `${totalFuel.toLocaleString('id-ID')} L` },
  ]

  return (
    <div className="stats">
      {items.map((item) => (
        <div key={item.label} className="stat">
          <div className="stat-icon">{item.icon}</div>
          <div>
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
