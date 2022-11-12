import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'
import Link from 'next/link'

import PowerButton from 'assets/icons/power-button.svg'
import Image from 'components/ui/Image'
import { logout, selectUser, updateUser } from 'modules/auth/slice'
import useUserDetails from 'modules/user/hook/useUserDetails'
import { useAppDispatch, useAppSelector } from 'store/hooks'

const Account = () => {
  const menuRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()
  const [dropdown, setDropdown] = useState(false)
  const storeUser = useAppSelector(selectUser)
  const { data: { data: user } = { data: storeUser } } = useUserDetails(storeUser._id)

  const toggleDropdown = () => {
    setDropdown(!dropdown)
  }

  useEffect(() => {
    if (JSON.stringify(user) !== JSON.stringify(storeUser)) {
      dispatch(updateUser(user))
    }
  }, [dispatch, user, storeUser])

  return <div
    ref={menuRef}
    className="group relative ml-2 flex cursor-pointer items-center rounded-full border border-gray-100 p-1.5 pl-3 transition-all hover:border-gray-300 sm:p-0 md:p-0"
    onClick={toggleDropdown}
  >
    <div className="flex items-center justify-center sm:h-8 sm:w-8 md:h-8 md:w-8">
      <span className="mr-2 text-base font-semibold sm:hidden md:hidden">
        {user?.username}
      </span>
      <span className="hidden mr-2 text-base font-semibold sm:block md:block">
        {user?.username?.[0]}
      </span>
    </div>
    <div
      className={clsx([
        'absolute top-[58px] right-0 w-[380px] transition-all duration-500 sm:fixed sm:top-[66px] md:fixed md:top-[66px]',
        dropdown ? 'block' : 'hidden',
      ])}
    >
      <div className="rounded-xl bg-white p-4 shadow-xl sm:rounded-none md:rounded-none">
        <div className="mb-3 flex items-center justify-end">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-gray-100 bg-red-50 transition-all hover:border-gray-300"
            >
              <Image src={PowerButton} width={20} height={20} alt="Power" />
            </button>
          </div>
        </div>

        <Link
          className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 p-3 transition-all ease-in-out hover:bg-gray-50/[0.5]"
          href={`/user/${user?.username}`}
        >
          <div className="flex items-center">
            <div className="ml-2">
              <h3 className="h6 mb-0.5">{user?.username}</h3>
              <div className="text-sm font-semibold text-gray-600">{user?.email}</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
}

export default Account
