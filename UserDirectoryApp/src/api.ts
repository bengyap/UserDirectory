import type { CreateUserInput, User } from './types'

const API_BASE = 'http://localhost:5096/api/users'

export async function getUsers(accessToken?: string): Promise<User[]> {
  const headers: HeadersInit = {}
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(API_BASE, { headers })

  if (!response.ok) {
    throw new Error('Failed to load users')
  }

  return response.json()
}

export async function createUser(payload: CreateUserInput, accessToken?: string): Promise<User> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }

  return response.json()
}
