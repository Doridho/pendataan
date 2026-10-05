import { useState } from 'react'
import { Truck, ArrowLeft } from 'lucide-react'
import { Storage } from '../services/storage'

export default function AdminLogin({ onSuccess, onBack }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (Storage.login(username, password)) {
      onSuccess()
    } else {
      setError('Username atau kata sandi salah.')
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="brand" style={{ justifyContent: 'center', marginBottom: 20 }}>
          <div className="brand-logo"><Truck size={16} /></div>
          <div>
            <div className="brand-name">Login Admin</div>
            <div className="brand-sub">Laporan Alat Berat</div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              className="input"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="login-password">Kata Sandi</label>
            <input
              id="login-password"
              type="password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Masuk</button>
        </form>

        <div className="login-hint">
          Demo — username: <strong>admin</strong>, kata sandi: <strong>admin123</strong>
        </div>

        <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={onBack}>
          <ArrowLeft size={14} /> Kembali ke Portal Operator
        </button>
      </div>
    </div>
  )
}
