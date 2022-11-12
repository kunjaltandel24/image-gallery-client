import useSWR from 'swr'

import { userDetails } from 'modules/user/api'

const useUserDetails = (
  id: string | null = null,
  suspense = false,
) => {
  return useSWR(
    id && [id],
    (id: string) => userDetails(id),
    {
      suspense,
      refreshInterval: 2 * 60 * 1000
    },
  )
}

export default useUserDetails
