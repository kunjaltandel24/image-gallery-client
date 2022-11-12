import { FC, Fragment, ReactNode } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'

const Modal: FC<{
  open: boolean
  title: string
  close: Function
  children?: ReactNode
  containerClassName?: string
}> = (props) => {
  const { open, title, close, children, containerClassName } = props
  return <Transition appear show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" open={open} onClose={() => close()}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md" aria-hidden="true" />
      </Transition.Child>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className={clsx(
              'w-full max-w-[575px] transform overflow-hidden overflow-y-auto rounded-xl bg-white transition-all',
              containerClassName,
            )}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                <Dialog.Title as="h6">{title}</Dialog.Title>
                <button type="button" className="rounded-full bg-gray-50 p-1" onClick={() => close()}>
                  <span className="material-icons-outlined text-base leading-none">close</span>
                </button>
              </div>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
}

export default Modal
