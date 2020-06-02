<template>
<div class="flex items-center justify-center mt-3 mx-3 lg:mx-0 lg:mt-32">
  <div class="bg-white rounded-lg w-full max-w-sm p-3">
    <h1 class="text-2xl lg:text-4xl font-medium">Confirm Account</h1>
    <p v-if="showResponse" class="text-red-500 lg:text-lg mb-3">{{ response }}</p>
    <p class="mt-6">
      <nuxt-link to="/reset" class="inline-block cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide p-2">Resend link</nuxt-link>
    </p>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      errors: {
        password: false,
        confirmPassword: false
      },
      password: null,
      confirmPassword: null,
      showResponse: false,
      response: null
    }
  },
  mounted() {
    if (!this.token) {
      this.$router.push(this.localePath({
        name: 'signup'
      }))
    }

    this.$axios.$post(process.env.API_URL + '/api/v1/confirm', {
      'token': this.token || null
    }).then(res => {
      console.log(res)

      this.$router.push(this.localePath({
        name: 'signin'
      }))
    }).catch(error => {
      this.showResponse = true

      if (error.hasOwnProperty('response')) {
        this.response = error.response.data.message
      } else {
        this.response = error.message
      }
    })
  },
  computed: {
    token() {
      return this.$route.params.token
    }
  },
  middleware: 'auth'
}
</script>
