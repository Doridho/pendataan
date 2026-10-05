import { useState } from 'react'
import PublicDashboard from './components/PublicDashboard'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { Storage } from './services/storage'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => Storage.isAdminLoggedIn())
  const [view, setView] = useState('public') // 'public' | 'login'

  if (isAdmin) {
    return (
      <AdminDashboard
        onLogout={() => {
          Storage.logout()
          setIsAdmin(false)
          setView('public')
        }}
      />
    )
  }

  if (view === 'login') {
    return (
      <AdminLogin
        onSuccess={() => setIsAdmin(true)}
        onBack={() => setView('public')}
      />
    )
  }

  return <PublicDashboard onGoLogin={() => setView('login')} />
}
