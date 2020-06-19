<template>
<div class="container mx-auto mt-3 lg:mt-0">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <div class="flex justify-between mb-3">
        <h1 class="text-2xl font-bold">{{ challenge.title }}</h1>
        <span>
          <nuxt-link :to="'/account'" class="inline-block bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Back</nuxt-link>
        </span>
      </div>
      <vue-markdown-plus class="markdown" :source="challenge.content" />
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      challenge: {}
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/detail`, {
        'id': this.challengeId.trim()
      }).then(res => {
        this.challenge = res.message
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    }
  },
  components: {
    VueMarkdownPlus
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
