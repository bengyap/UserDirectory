import { useAuth0 } from '@auth0/auth0-react'

function WelcomePage() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="page">
      <h1>Welcome to User Directory</h1>
      <p className="subtitle">Manage your users efficiently.</p>

      <div className="welcome-content">
        <p>Please log in to manage users.</p>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    </div>
  )
}

export default WelcomePage
