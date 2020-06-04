<template>
<div class="container mx-auto mt-3 lg:mt-0">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <div class="flex justify-between mb-3">
        <h1 class="text-2xl font-bold">{{ task.title }}</h1>
        <span>
          <nuxt-link :to="'/account'" class="inline-block bg-green-500 hover:bg-green-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Dashboard</nuxt-link>
        </span>
      </div>
      <vue-markdown-plus class="markdown" :source="task.content" />
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      task: {}
    }
  },
  created() {
    if (this.taskId) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/task/detail', {
        'id': this.taskId.trim()
      }).then(res => {
        this.task = res.message
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
    taskId() {
      return this.$route.params.id
    }
  },
  middleware: 'auth',
  methods: {}
}
</script>
