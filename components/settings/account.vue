<template>
<div>
  <h2 class="text-2xl mb-4">Before You Delete</h2>
  <p class="lg:w-2/3 lg:text-xl mb-4">Please be aware that deleting your account is irreversible. We can’t help you recover your account after deletion. When you delete your account, you remove all of your challenges, tasks, and tags. Your username
    will be released for re-use.</p>
  <button type="submit" @click="deleteAccount" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Delete Account</button>
</div>
</template>


<script>
export default {
  data() {
    return {}
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  methods: {
    deleteAccount() {
      this.$axios.$put(process.env.API_URL + '/api/v1/user/delete/' + this.userId).then(res => {
        console.log(res)
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
</script>
