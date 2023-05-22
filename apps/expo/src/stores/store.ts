import { registerInDevtools, Store } from 'pullstate'

export const AuthStore = new Store({
  isLoggedIn: false,
  token: '',
  csrfToken: '',
})

registerInDevtools({ AuthStore })
