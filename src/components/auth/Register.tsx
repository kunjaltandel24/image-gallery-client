import { useState } from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'

import { setAuthModal } from 'modules/app/slice'
import { userRegister } from 'modules/auth/slice'
import { useAppDispatch } from 'store/hooks'

type RegisterParams = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const dispatch = useAppDispatch()
  const { formState: { errors }, getValues, handleSubmit, register } = useForm<RegisterParams>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const [apiError, setApiError] = useState<string | null>(null)

  const submit: SubmitHandler<RegisterParams> = async (data) => {
    try {
      await dispatch(
        userRegister({
          ...data
        })
      ).unwrap()
      dispatch(setAuthModal({ authModal: null }))
    } catch (e) {
      console.error()
      setApiError('Failed to login! Please try again')
    }
  }

  return <form onSubmit={handleSubmit(submit)} className="px-6 pt-4 pb-6">
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
      <div className="col-span-2 sm:col-auto">
        <div className="mb-3">
          <div className="mb-2 flex items-center space-x-1">
            <label htmlFor="usernameField" className="h6 font-semibold">
              Username
            </label>
          </div>
          <input
            id="usernameField"
            type="text"
            className="form-input-explore form-input w-full"
            {...register('username', {
              required: true,
              validate: (value) => (
                !/^(\w){1,15}$/i.test(value) &&
                'Please enter valid username! username can only contains alphabets, digits and underscore(_)'
              ) || true,
            })}
          />
          {errors.username && <span className="text-sm text-red-500">{errors.username.message || 'username is required'}</span>}
        </div>
        <div className="mb-3">
          <div className="mb-2 flex items-center space-x-1">
            <label htmlFor="emailField" className="h6 font-semibold">
              Email
            </label>
          </div>
          <input
            id="emailField"
            type="email"
            className="form-input-explore form-input w-full"
            {...register('email', {
              required: true,
            })}
          />
          {errors.email && <span className="text-sm text-red-500">{errors.email.message || 'email is required'}</span>}
        </div>
        <div className="mb-5">
          <div className="mb-2 flex items-center space-x-1">
            <label htmlFor="passwordField" className="h6 font-semibold">
              Password
            </label>
          </div>
          <input
            id="passwordField"
            type="password"
            className="form-input-explore form-input w-full"
            {...register('password', {
              required: true,
              validate: (value) => (
                !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(value) &&
                'Password must contains one capital Alphabet, one small Alphabet, one number and any special character'
              ) || true,
            })}
          />
          {errors.password && <span className="text-sm text-red-500">{errors.password.message || 'Password is required'}</span>}
        </div>
        <div className="mb-5">
          <div className="mb-2 flex items-center space-x-1">
            <label htmlFor="confirmPasswordField" className="h6 font-semibold">
              Confirm Password
            </label>
          </div>
          <input
            id="confirmPasswordField"
            type="password"
            className="form-input-explore form-input w-full"
            {...register('confirmPassword', {
              required: true,
              validate: (value) => (
                getValues('password') !== value &&
                'Confirm Password does not match with password'
              ) || true,
            })}
          />
          {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword.message || 'Confirm Password is required'}</span>}
        </div>
        {apiError && <span className="mb-2 text-sm text-red-500">{apiError}</span>}
        <button
          type="submit"
          className="btn btn-lg btn-black w-full"
        >
          Sign Up
        </button>
        <div className="flex justify-center mt-2">
          <div>
            Already have an account <span
              className="cursor-pointer text-[#3366CC]"
              onClick={() => dispatch(setAuthModal({ authModal: 'login' }))}
            >sign in?</span>
          </div>
        </div>
      </div>
    </div>
  </form>
}

export default Register
