import { describe, expect, it, vi, afterEach } from 'vitest'
import { createUser, getUsers } from './api'

describe('api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('includes auth header when token is provided to getUsers', async () => {
    const users = [{ id: 1, name: 'Alice', age: 30, city: 'Austin', state: 'TX', pincode: '73301' }]
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await getUsers('token-123')

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5096/api/users', {
      headers: { Authorization: 'Bearer token-123' },
    })
    expect(result).toEqual(users)
  })

  it('throws when getUsers response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    await expect(getUsers()).rejects.toThrow('Failed to load users')
  })

  it('posts payload and returns user for createUser', async () => {
    const payload = {
      name: 'Bob',
      age: 25,
      city: 'Seattle',
      state: 'WA',
      pincode: '98101',
    }
    const created = { id: 10, ...payload }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(created), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await createUser(payload, 'token-abc')

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5096/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-abc',
      },
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(created)
  })

  it('throws when createUser response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 400 }))

    await expect(
      createUser({ name: 'Sam', age: 20, city: 'LA', state: 'CA', pincode: '9001' }),
    ).rejects.toThrow('Failed to create user')
  })
})
