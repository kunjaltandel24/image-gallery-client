import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'

import app from 'modules/app/slice'
import userAuth from 'modules/auth/slice'

export const store = configureStore({
  reducer: {
    app,
    userAuth,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

