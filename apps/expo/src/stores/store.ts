import { registerInDevtools, Store } from 'pullstate'

export const AuthStore = new Store({
  isLoggedIn: true,
  token: '',
  csrfToken: '',
})

registerInDevtools({ AuthStore })
