import { useCallback, useEffect } from 'react'

import { NextPage } from 'next'
import router from 'next/router'
import validator from 'validator'

import { verify } from 'modules/auth/api'

const Verify: NextPage<{ verificationToken: string }> = ({ verificationToken }) => {
  const verifyCall = useCallback(() => {
    verify({ verificationToken })
      .catch((error) => {
        console.error('verification failed: ', error)
      })
      .finally(() => {
        router.push('/')
      })
  }, [verificationToken])
  useEffect(() => {
    const vtPayload = (verificationToken || '').split('.')[1]
    if (
      !verificationToken ||
      (process.browser && !validator.isJSON(atob(vtPayload)))
    ) {
      router.push('/')
      return
    }
    verifyCall()
  }, [verificationToken, verifyCall])
  return <div className="w-[100vw] h-[100vh] flex items-center justify-center">
    <div className="flex h-40 w-40 relative">
      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-300 opacity-75"></div>
      <div className="relative inline-flex rounded-full h-40 w-40 bg-gray-400 flex items-center justify-center">
        <span className="text-2xl">verifying...</span>
      </div>
    </div>
  </div>
}

export const getServerSideProps = (props: { query: { [key: string]: string | string[] | any | any[] } }) => {
  const { query } = props
  return {
    props: {
      verificationToken: query.vt,
    },
  }
}

export default Verify
