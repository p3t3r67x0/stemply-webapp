const Cookie = process.client ? require('js-cookie') : undefined

export default ({
  app,
  store
}) => {
  app.$axios.defaults.headers.get['Content-Type'] = 'application/json'
  app.$axios.defaults.headers.put['Content-Type'] = 'application/json'
  app.$axios.defaults.headers.post['Content-Type'] = 'application/json'
  app.$axios.defaults.headers.delete['Content-Type'] = 'application/json'

  app.$axios.interceptors.request.use(
    function(config) {
      let url = null

      if (config.url.hasOwnProperty('url')) {
        url = config.url['url']
      } else {
        url = config.url
      }

      if (url.includes('/api/v1/token/refresh')) {
        const refreshToken = Cookie.get('USER_REFRESH_TOKEN')

        if (refreshToken) {
          config.headers.Authorization = 'Bearer ' + refreshToken
        }
      } else {
        const accessToken = Cookie.get('USER_ACCESS_TOKEN')

        if (accessToken) {
          store.commit('updateUserId', Cookie.get('USER_ID'))
          config.headers.Authorization = 'Bearer ' + accessToken
        }
      }

      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  app.$axios.interceptors.response.use(
    function(response) {
      return response
    },
    function(error) {
      if (error.config && error.response && error.response.status === 401) {
        const refreshToken = Cookie.get('USER_REFRESH_TOKEN')

        if (refreshToken) {
          return app.$axios.$post(`${process.env.API_URL}/api/v1/token/refresh`, {
            headers: {
              'Authorization': 'Bearer ' + refreshToken
            }
          }).then((response) => {
            store.commit('updateAccessToken', response.access_token)
            Cookie.set('USER_ACCESS_TOKEN', response.access_token, {
              samesite: 'Strict',
              secure: true
            })

            error.config.headers.Authorization = 'Bearer ' + response.access_token
            return app.$axios.request(error.config)
          }).catch((error) => {
            return Promise.reject(error)
          })
        }
      }

      return Promise.reject(error)
    }
  )
}
