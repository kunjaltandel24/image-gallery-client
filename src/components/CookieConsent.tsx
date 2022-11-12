import { CookieConsent } from 'react-cookie-consent'

import { tokenSelector } from 'modules/auth/slice'
import { useAppSelector } from 'store/hooks'

const CookiePermission = () => {
  const token = useAppSelector(tokenSelector)
  if (!token) {
    return null
  }
  return <CookieConsent
    location="bottom"
    buttonText="Sure man!!"
    cookieName="token"
    cookieValue={token}
    style={{ background: '#2B373B' }}
    buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
    expires={2}
  >
    <p>This website uses cookies to enhance the user experience.</p>
    <span style={{ fontSize: '10px' }}>This cookie enables you to view private image of sites :O</span>
  </CookieConsent>
}

export default CookiePermission
