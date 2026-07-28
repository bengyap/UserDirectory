import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useAuth0 } from '@auth0/auth0-react'
import { LogoutButton } from './LogoutButton'

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}))

const mockedUseAuth0 = vi.mocked(useAuth0)

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when user is not authenticated', () => {
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      logout: vi.fn(),
    } as ReturnType<typeof useAuth0>)

    const { container } = render(<LogoutButton />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows user name and calls logout with returnTo on click', () => {
    const logout = vi.fn()
    mockedUseAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout,
    } as ReturnType<typeof useAuth0>)

    render(<LogoutButton />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))

    expect(logout).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    })
  })
})
