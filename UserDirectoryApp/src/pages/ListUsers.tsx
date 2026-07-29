import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getUsers } from '../api'
import type { User } from '../types'

type ListUsersPageProps = {
  toast: string
  onToastShown: () => void
}

function ListUsersPage({ toast, onToastShown }: ListUsersPageProps) {
  const { getAccessTokenSilently } = useAuth0()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadUsers() {
      setLoading(true)
      setError('')

      try {
        const accessToken = await getAccessTokenSilently()
        const data = await getUsers(accessToken)
        if (active) {
          setUsers(data)
        }
      } catch {
        if (active) {
          setError('Could not load users. Please try again.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => onToastShown(), 3000)
    return () => window.clearTimeout(timer)
  }, [toast, onToastShown])

  return (
    <div className="page">
      <h1>User List</h1>
      <p className="subtitle">All users from the API.</p>

      {toast ? <p className="toast success">{toast}</p> : null}

      {loading ? <div className="spinner">Loading users...</div> : null}
      {!loading && error ? <p className="error-text">{error}</p> : null}

      {!loading && !error && users.length === 0 ? (
        <p className="empty-state">No users found. Add your first user from the Add page.</p>
      ) : null}

      {!loading && !error && users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>{user.state}</td>
                <td>{user.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default ListUsersPage
