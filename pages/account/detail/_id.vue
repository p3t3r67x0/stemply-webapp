<template>
<div class="container mx-auto rounded-lg bg-white p-3 mt-3">
  <div class="m-8 mb-16">
    <div class="flex">
      <h1 class="text-2xl font-bold mb-2 justify-content-left">{{ challenge.title }}</h1>
      <a href="/account" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto justify-content-right">All challenges</a>
    </div>
  </div>
  <div class="mx-8 mb-8">
    <p>{{ challenge.content }}</p>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      challenge: {}
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/detail', {
        'id': this.challengeId.trim()
      }).then(res => {
        this.challenge = res.message
      }).catch(error => {
        console.log(error)
      })
    }
  },
  computed: {
    challengeId() {
      return this.$route.params.id
    }
  },
  middleware: 'auth',
  methods: {}
}
</script>
