import { useAuth0 } from '@auth0/auth0-react'

export function LogoutButton() {
  const { isAuthenticated, user, logout } = useAuth0()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="auth-user">
      <span className="user-name">{user?.name}</span>
      <button
        className="logout-btn"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Logout
      </button>
    </div>
  )
}
