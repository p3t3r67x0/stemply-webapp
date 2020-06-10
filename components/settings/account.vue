<template>
<div>
  <h2 class="text-2xl mb-4">Before You Delete</h2>
  <p class="lg:w-2/3 lg:text-xl mb-4">Please be aware that deleting your account is irreversible. We can’t help you recover your account after deletion. When you delete your account, you remove all of your challenges, tasks, and tags. Your username
    will be released for re-use.</p>
  <button type="submit" @click="deleteAccount" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Delete Account</button>
</div>
</template>

<script>
const Cookie = require('js-cookie')

export default {
  data() {
    return {}
  },
  methods: {
    deleteAccount() {
      if (confirm('Are you sure to delete your account?')) {
        this.$axios.$post(process.env.API_URL + '/api/v1/user/delete/account').then(res => {
          console.log(res)

          this.$store.commit('updateUserId', null)
          this.$store.commit('updateUserName', null)
          this.$store.commit('updateUserRoles', null)
          this.$store.commit('updateUserAvatar', null)
          this.$store.commit('updateUserAvatarUrl', null)
          this.$store.commit('updateRefreshToken', null)
          this.$store.commit('updateAccessToken', null)

          Cookie.remove('USER_ID')
          Cookie.remove('USER_ROLES')
          Cookie.remove('USER_AVATAR_URL')
          Cookie.remove('USER_ACCESS_TOKEN')
          Cookie.remove('USER_REFRESH_TOKEN')

          this.$router.push(this.localePath({
            name: 'signup'
          }))
        }).catch(error => {
          if (error.hasOwnProperty('response')) {
            this.response = error.response.data.message
            this.responseError = true
            this.showResponse = true
          } else {
            console.log(error)
          }
        })
      }
    }
  }
}
</script>
