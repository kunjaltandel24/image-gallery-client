import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { login, register } from 'modules/auth/api'
import storage from 'services/storage'
import { RootState } from 'store'

export interface IUser {
  _id: string
  id: string
  email: string
  username: string
  stripeCustomerId: string
  stripeAccountId?: string
  stripeAccountCompleted: boolean
  accountBalance: number
  paymentMethods: string[]
  verificationCode: string
  isVerified: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthState {
  user: IUser | null | any
  loggedIn: boolean
  token: string | null
}

const initialState: AuthState = {
  user: storage.getItem('auth.user') || null,
  loggedIn: !!storage.getItem('auth.token'),
  token: storage.getItem('auth.token') || null,
}

export const userLogin = createAsyncThunk(
  'user/login',
  async (body: any) => {
    const response = await login(body)
    return response.data
  },
)

export const userRegister = createAsyncThunk(
  'user/register',
  async (body: any) => {
    const response = await register(body)
    return response.data
  },
)

const loginOrRegisterStateSet = (state: AuthState, action: PayloadAction<{ user: IUser, token: string }>) => {
  state.loggedIn = true
  state.user = action.payload.user
  state.token = action.payload.token
  storage.setItem('auth.user', state.user)
  storage.setItem('auth.token', state.token)
}

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.loggedIn = false
      state.token = null
      storage.removeItem('auth.user')
      storage.removeItem('auth.token')
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
      storage.setItem('auth.user', state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, loginOrRegisterStateSet)
      .addCase(userRegister.fulfilled, loginOrRegisterStateSet)
  },
})

export const { logout, updateUser } = userAuthSlice.actions

export const selectUser = (state: RootState) => state.userAuth.user
export const tokenSelector = (state: RootState) => state.userAuth.token
export const isLoggedInSelector = (state: RootState): boolean => state.userAuth.loggedIn

export default userAuthSlice.reducer
