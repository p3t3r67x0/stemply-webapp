<template>
<div class="container mx-auto bg-white rounded-lg p-3 mt-3">
  <h1 class="text-2xl font-bold mb-2">Personal Dashboard</h1>
  <p class="text-lg">Your challange </p>
</div>
</template>

<script>
export default {
  data() {
    return {
      challenges: null
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge').then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {}
}
</script>
