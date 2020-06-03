<template>
<div class="container mx-auto mt-3">
  <div class="flex justify-between">
    <h1 class="text-2xl font-bold mb-6">Overview</h1>
    <p>
      <nuxt-link to="/admin/challenge" class="inline-block bg-green-500 hover:bg-green-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">New challenge</nuxt-link>
    </p>
  </div>
  <ul>
    <li v-for="challenge in challenges" class="bg-white rounded-lg p-3 mb-6">
      <div class="flex justify-between">
        <h2 class="text-xl font-semibold mb-3">Challenge</h2>
        <p>
          <nuxt-link :to="generateTaskAddLink(challenge._id)" class="inline-block bg-orange-500 hover:bg-orange-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Add task</nuxt-link>
        </p>
      </div>
      <div class="bg-gray-200 rounded-lg p-2">
        <span class="flex justify-betweeen mb-1">
          <h3 class="w-full lg:w-10/12 text-xl font-bold">{{ challenge.title }}</h3>
          <p class="w-full text-right">
            <button type="button" @click="deleteChallenge(challenge._id)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
            <nuxt-link :to="generateChallangeLink(challenge._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
          </p>
        </span>
        <span class="flex">
          <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3 mr-4">From {{ challenge.fromDate }}</span>
          <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3">To {{ challenge.toDate }}</span>
        </span>
        <vue-markdown-plus class="markdown" :source="challenge.content" />
      </div>
      <h2 v-if="challenge.tasks.length > 0" class="text-xl font-semibold mt-6">Tasks</h2>
      <ul v-if="challenge.tasks.length > 0">
        <li v-for="task in challenge.tasks" class="bg-gray-200 rounded-lg p-2 mt-3">
          <span class="flex justify-betweeen mb-1">
            <h3 class="w-full lg:w-10/12 text-lg font-bold">{{ task.title }}</h3>
            <p class="w-full text-right">
              <button type="button" @click="deleteTask(task._id)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
              <nuxt-link :to="generateTaskEditLink(task._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
            </p>
          </span>
          <span class="flex">
            <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3 mr-4">From {{ task.fromDate }}</span>
            <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3">To {{ task.toDate }}</span>
          </span>
          <vue-markdown-plus class="markdown" :source="task.content" />
        </li>
      </ul>
    </li>
  </ul>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      challenges: []
    }
  },
  created() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/task').then(res => {
      res.message.forEach(challenge => {
        const tasks = []

        challenge.tasks.forEach(task => {
          tasks.push({
            _id: task._id,
            toDate: task.to,
            fromDate: task.from,
            content: task.content,
            title: task.title
          })
        })

        this.challenges.push({
          _id: challenge._id,
          toDate: challenge.to,
          fromDate: challenge.from,
          content: challenge.content,
          title: challenge.title,
          tasks: tasks

        })
      })
    }).catch(error => {
      console.log(error.response.data)
    })
  },
  components: {
    VueMarkdownPlus
  },
  middleware: 'auth',
  methods: {
    generateChallangeLink(id) {
      return `/admin/challenge/${id}`
    },
    generateTaskAddLink(id) {
      return `/admin/task/add/${id}`
    },
    generateTaskEditLink(id) {
      return `/admin/task/edit/${id}`
    },
    deleteTask(id) {
      alert('Not implemented yet')
    },
    deleteChallenge(id) {
      alert('Not implemented yet')
    },
    secondsToDays(seconds) {
      const days = Math.round(seconds / 3600 / 24)

      if (days <= 1 && days != 0) {
        return `${days} day`
      } else {
        return `${days} days`
      }
    }
  }
}
</script>
