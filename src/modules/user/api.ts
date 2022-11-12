import { get, post } from 'services/axios'

export const payoutAccountOnboardingLink = () =>
  get('users/payout-account-link')
export const payoutAccountVerify = () => get('users/payout-account-verify')
export const withdraw = (body: any) => post('users/withdraw', body)
export const userDetails = (id: string) => get(`users/${id}`)
export const resendVerification = () => get('users/resend-verification')
