import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import { Provider } from 'react-redux'

import CookieConsent from 'components/CookieConsent'
import { store } from 'store'

import 'styles/globals.scss'
import 'styles/tailwind.scss'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) =>
  <>
    <NextNProgress color="#000" stopDelayMs={500} height={2} />
    <Provider store={store}>
      <Component {...pageProps} />
      <CookieConsent />
    </Provider>
  </>


export default MyApp
