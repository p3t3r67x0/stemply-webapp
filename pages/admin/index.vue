<template>
<div class="container mx-auto mt-3">
  <div class="mx-3 lg:mx-0">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-6">{{ $t('navigation.overview') }}</h1>
      <span>
        <nuxt-link to="/admin/challenge" class="inline-block bg-green-500 hover:bg-green-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">New challenge</nuxt-link>
      </span>
    </div>
    <ul>
      <li v-for="(challenge, indexChallenge) in challenges" class="bg-white rounded-lg p-3 mb-6">
        <div class="flex justify-between">
          <h2 class="text-xl font-semibold mb-3">{{ $t('challenge') }}</h2>
          <p>
            <nuxt-link :to="generateTaskAddLink(challenge._id)" class="inline-block bg-orange-500 hover:bg-orange-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Add task</nuxt-link>
          </p>
        </div>
        <div class="bg-gray-200 rounded-lg p-2">
          <span class="flex justify-betweeen mb-1">
            <h3 class="w-full lg:w-10/12 text-xl font-bold">{{ challenge.title }}</h3>
            <p class="w-full text-right">
              <button ref="deleteChallenge" type="button" @click="deleteChallenge(challenge._id, indexChallenge)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
              <nuxt-link :to="generateChallangeLink(challenge._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
            </p>
          </span>
          <span class="flex">
            <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3 mr-4">From {{ challenge.fromDate }}</span>
            <span class="inline-block bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3">To {{ challenge.toDate }}</span>
          </span>
          <vue-markdown-plus class="markdown" :source="challenge.content" />
        </div>
        <h2 v-if="challenge.tasks.length > 0" class="text-xl font-semibold mt-6">{{ $t('tasks') }}</h2>
        <ul v-if="challenge.tasks.length > 0">
          <li v-for="(task, indexTask) in challenge.tasks" :key="task._id" class="bg-gray-200 rounded-lg p-2 mt-3">
            <span class="flex justify-betweeen mb-1">
              <h3 class="w-full lg:w-10/12 text-lg font-bold">{{ task.title }}</h3>
              <p class="w-full text-right">
                <button ref="deleteTask" type="button" @click="deleteTask(task._id, indexChallenge, indexTask)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
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
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error.message)
      }
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
    deleteTask(id, indexChallenge, indexTask) {
      this.$refs.deleteTask[indexTask].blur()

      this.$axios.$delete(process.env.API_URL + '/api/v1/challenge/task/' + id).then((res) => {
        this.challenges[indexChallenge].tasks.splice(indexTask, 1)

        console.log(res.message)
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error.message)
        }
      })
    },
    deleteChallenge(id, indexChallenge) {
      this.$refs.deleteChallenge[indexChallenge].blur()

      this.$axios.$delete(process.env.API_URL + '/api/v1/challenge/' + id).then((res) => {
        this.challenges.splice(indexChallenge, 1)

        console.log(res.message)
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error.message)
        }
      })
    }
  }
}
</script>
