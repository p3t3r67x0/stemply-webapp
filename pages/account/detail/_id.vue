<template>
<div class="container mx-auto rounded-lg bg-white p-3 mt-3">
  tbd.
</div>
</template>

<script>
export default {
  data() {
    return {
      challenge: null
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/detail', {
        'id': this.challengeId.trim()
      }).then(res => {
        if (res.message[0]) {
          console.log(res.message[0])
          this.challenge = res.message[0]
        }
      }).catch(error => {
        console.log(error.response.data)
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
