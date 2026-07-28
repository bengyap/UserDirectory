import { type FormEvent, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { createUser } from '../api'
import type { CreateUserInput } from '../types'

const blankForm = {
  name: '',
  age: '',
  city: '',
  state: '',
  pincode: '',
}

type FormState = typeof blankForm

type FormErrors = Partial<Record<keyof FormState, string>>

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {}
  const trimmedName = form.name.trim()
  const trimmedCity = form.city.trim()
  const trimmedState = form.state.trim()
  const trimmedPincode = form.pincode.trim()

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters.'
  }

  if (!/^\d+$/.test(form.age)) {
    errors.age = 'Age must be an integer.'
  } else {
    const age = Number.parseInt(form.age, 10)
    if (age < 0 || age > 120) {
      errors.age = 'Age must be between 0 and 120.'
    }
  }

  if (!trimmedCity) {
    errors.city = 'City is required.'
  }

  if (!trimmedState) {
    errors.state = 'State is required.'
  }

  if (trimmedPincode.length < 4 || trimmedPincode.length > 10) {
    errors.pincode = 'Pincode must be 4 to 10 characters.'
  }

  return errors
}

type AddUserPageProps = {
  onUserCreated: () => void
}

function AddUserPage({ onUserCreated }: AddUserPageProps) {
  const { getAccessTokenSilently } = useAuth0()
  const [form, setForm] = useState<FormState>(blankForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setFieldValue<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload: CreateUserInput = {
      name: form.name.trim(),
      age: Number.parseInt(form.age, 10),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const accessToken = await getAccessTokenSilently()
      await createUser(payload, accessToken)
      setForm(blankForm)
      onUserCreated()
    } catch {
      setSubmitError('Unable to add user right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <h1>Add User</h1>
      <p className="subtitle">Create a new directory user.</p>

      <form onSubmit={handleSubmit} className="common-form" noValidate>
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => setFieldValue('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? (
            <span id="name-error" className="field-error">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label>
          Age
          <input
            value={form.age}
            onChange={(event) => setFieldValue('age', event.target.value)}
            inputMode="numeric"
            aria-invalid={Boolean(errors.age)}
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age ? (
            <span id="age-error" className="field-error">
              {errors.age}
            </span>
          ) : null}
        </label>

        <label>
          City
          <input
            value={form.city}
            onChange={(event) => setFieldValue('city', event.target.value)}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city ? (
            <span id="city-error" className="field-error">
              {errors.city}
            </span>
          ) : null}
        </label>

        <label>
          State
          <input
            value={form.state}
            onChange={(event) => setFieldValue('state', event.target.value)}
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'state-error' : undefined}
          />
          {errors.state ? (
            <span id="state-error" className="field-error">
              {errors.state}
            </span>
          ) : null}
        </label>

        <label>
          Pincode
          <input
            value={form.pincode}
            onChange={(event) => setFieldValue('pincode', event.target.value)}
            aria-invalid={Boolean(errors.pincode)}
            aria-describedby={errors.pincode ? 'pincode-error' : undefined}
          />
          {errors.pincode ? (
            <span id="pincode-error" className="field-error">
              {errors.pincode}
            </span>
          ) : null}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save User'}
        </button>
      </form>

      {submitError ? <p className="error-text">{submitError}</p> : null}
    </div>
  )
}

export default AddUserPage
