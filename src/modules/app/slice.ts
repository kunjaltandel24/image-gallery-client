import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { RootState } from 'store'

interface AppState {
  authModal: null | 'login' | 'register'
}

const initialState: AppState = {
  authModal: null,
}

const appSlice = createSlice({
  name: 'app',

  initialState: initialState,

  reducers: {
    setEnt(state, action) {
      return action.payload
    },
    setAuthModal(state, action: PayloadAction<AppState>) {
      state.authModal = action.payload.authModal
    },
  },

  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state) => {
      return {
        ...state,
      }
    })
  },
})

export const { setAuthModal } = appSlice.actions
export const authModalSelector = (state: RootState) => state.app.authModal

export default appSlice.reducer
