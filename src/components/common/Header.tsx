import { FC, useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
// import { useRouter } from 'next/router'

import Logo from 'assets/logos/logo.png'
import Login from 'components/auth/Login'
import Register from 'components/auth/Register'
import Account from 'components/common/Account'
import CheckoutModal from 'components/common/CheckoutModal'
import Image from 'components/ui/Image'
import Modal from 'components/ui/Modal';
import { authModalSelector, setAuthModal } from 'modules/app/slice';
import { isLoggedInSelector, selectUser } from 'modules/auth/slice'
import { resendVerification } from 'modules/user/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'



type HeaderProps = {
  showCheckoutBtn?: boolean
  checkoutImages?: any[]
  removeItem?: Function
  clearCart?: Function
}

const Header: FC<HeaderProps> = (props) => {
  const { showCheckoutBtn, checkoutImages, removeItem, clearCart } = props
  // const router = useRouter()

  const dispatch = useAppDispatch()
  const authModal = useAppSelector(authModalSelector)
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const authUser = useAppSelector(selectUser) || {}
  const [loginState, setLoginState] = useState<boolean>(false)
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false)
  const [showVerificationWarning, setShowVerificationWarning] = useState<boolean>(false)
  const [verificationLinkStatus, setVerificationLinkStatus] = useState<string | null>(null)

  useEffect(() => {
    setLoginState(isLoggedIn)
  }, [isLoggedIn])

  useEffect(() => {
    setShowVerificationWarning(isLoggedIn && !authUser.isVerified)
  }, [authUser.isVerified, isLoggedIn])

  const toggleCheckoutModal = useCallback(() => {
    setCheckoutModal(!checkoutModal)
  }, [checkoutModal])

  const openLogin = () => dispatch(setAuthModal({ authModal: 'login' }))

  const resendVerificationLink = () => {
    resendVerification()
      .then(() => {
        setVerificationLinkStatus('Verification Link sent')
      })
      .catch(() => {
        setVerificationLinkStatus('Failed to resend verification link')
      })
      .finally(() => {
        setTimeout(() => {
          setVerificationLinkStatus(null)
        }, 5000)
      })
  }

  return (
    <>
      <header className="header sticky top-0 z-50 bg-white sm:py-3 md:py-3 drop-shadow-md">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link className="mr-6 flex items-center sm:hidden md:hidden py-2" href="/">
                <Image src={Logo} width={45} alt="logo" />
              </Link>
              <Link href="/" className="mr-2 hidden items-center sm:flex sm:w-[42] md:flex md:w-[42px] py-2">
                <Image src={Logo} width={28} alt="logo" />
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end">
              {/* search box */}
              {showCheckoutBtn && <button
                className="btn btn-default btn-sm mr-4 rounded-full py-1"
                type="button"
                onClick={() => toggleCheckoutModal()}
              >
                <span className="material-icons-outlined text-xl">shopping_cart</span>
              </button>}
              {loginState && <Account />}
              {!loginState && <button
                className="btn btn-black btn-sm ml-4 rounded-full sm:ml-2 md:ml-2"
                type="button"
                onClick={() => openLogin()}
              >
                SignIn
              </button>}
            </div>
          </div>
        </div>
      </header>
      {showVerificationWarning && <div className="w-full bg-yellow-50 p-4 mb-3 text-center rounded-md font-semibold text-yellow-700">
        Please verify your account. missing verification link&nbsp;
        <span className="text-purple-500 cursor-pointer underline" onClick={resendVerificationLink}>
          click here!
        </span>
        <br/>
        {verificationLinkStatus}
      </div>}
      <Modal
        open={authModal === 'login'}
        title={'Sign In'}
        close={() => dispatch(setAuthModal({ authModal: null }))}
      >
        <Login />
      </Modal>
      <Modal
        open={authModal === 'register'}
        title={'Sign Up'}
        close={() => dispatch(setAuthModal({ authModal: null }))}
      >
        <Register/>
      </Modal>
      {Boolean(checkoutImages && checkoutImages.length) && <Modal
        open={checkoutModal}
        title={'Checkout'}
        close={() => toggleCheckoutModal()}
      >
        <CheckoutModal
          close={() => toggleCheckoutModal()}
          removeItem={removeItem}
          images={checkoutImages as any[]}
          clearCart={clearCart}
        />
      </Modal>}
    </>
  )
}

export default Header
