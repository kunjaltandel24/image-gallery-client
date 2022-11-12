import { useState } from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'
import validator from 'validator'

import { setAuthModal } from 'modules/app/slice'
import { userLogin } from 'modules/auth/slice'
import { useAppDispatch } from 'store/hooks'

type LoginParams = {
  username: string
  password: string
}

const Login = () => {
  const dispatch = useAppDispatch()
  const { formState: { errors }, handleSubmit, register } = useForm<LoginParams>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const [apiError, setApiError] = useState<string | null>(null)

  const submit: SubmitHandler<LoginParams> = async (data) => {
    try {
      await dispatch(
        userLogin({
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
            <label htmlFor="twitterField" className="h6 font-semibold">
              Username/Email
            </label>
          </div>
          <input
            id="usernameField"
            type="text"
            className="form-input-explore form-input w-full"
            {...register('username', {
              required: true,
              validate: (value) => !/^(\w){1,15}$/i.test(value) && !validator.isEmail(value) ?
                'Please enter valid username or email' : true,
            })}
          />
          {errors.username && <span className="text-sm text-red-500">{errors.username.message || 'username/email is required'}</span>}
        </div>
        <div className="mb-5">
          <div className="mb-2 flex items-center space-x-1">
            <label htmlFor="twitterField" className="h6 font-semibold">
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
        {apiError && <span className="mb-2 text-sm text-red-500">{apiError}</span>}
        <button
          type="submit"
          className="btn btn-lg btn-black w-full"
        >
          Sign In
        </button>
        <div className="flex justify-center mt-2">
          <div>
            New here <span
              className="cursor-pointer text-[#3366CC]"
              onClick={() => dispatch(setAuthModal({ authModal: 'register' }))}
            >create account?</span>
          </div>
        </div>
      </div>
    </div>
  </form>
}

export default Login
