import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import AddUserPage from './pages/AddUser'
import ListUsersPage from './pages/ListUsers'
import WelcomePage from './pages/WelcomePage'
import { LogoutButton } from './LogoutButton'
import './App.css'

type AppView = 'list' | 'add'

function App() {
  const { isAuthenticated } = useAuth0()
  const [view, setView] = useState<AppView>('list')
  const [toast, setToast] = useState('')

  function handleUserCreated() {
    setView('list')
    setToast('User created successfully.')
  }

  if (!isAuthenticated) {
    return <WelcomePage />
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-links">
          <button type="button" onClick={() => setView('add')} aria-pressed={view === 'add'}>
            Add
          </button>
          <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'}>
            List
          </button>
        </div>
        <LogoutButton />
      </nav>

      <main>
        {view === 'add' ? <AddUserPage onUserCreated={handleUserCreated} /> : null}
        {view === 'list' ? <ListUsersPage toast={toast} onToastShown={() => setToast('')} /> : null}
      </main>
    </>
  )
}

export default App