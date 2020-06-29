<template>
<div class="container mx-auto mt-3 lg:mt-0">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <div class="flex justify-between mb-3">
        <h1 class="text-2xl font-bold">{{ challenge.title }}</h1>
          <span v-on:click="back" class="inline-block bg-gray-600 hover:bg-gray-700 cursor-pointer focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Back</span>
        </div>
        <div class="xl:flex" v-if="challenge">
          <div v-if="challenge" class="w-auto border-r-2 p-4 m-4 overflow-scroll" :class="[showtasks ? 'modal-text-small' : 'modal-text']">
            <vue-markdown-plus class="markdown" :source="challenge.content" />
          </div>
          <div v-if="challenge && challenge.tasks" class="w-full p-4 m-4 w-2/3 p-4">
            <div class="pb-3">
              <h3 class="text-xl"><fa :icon="['fas', showtasks ? 'angle-up' : 'angle-down']" @click="toggleShowTasks" class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3 md:hidden" /> Tasks</h3>
              <hr>
            </div>
            <div class="overflow-scroll md:block" :class="[ showtasks ? 'block-modal modal-text' : 'hidden modal-text-small']">
              <ul :key="challenge.tasks.length">
                <li v-for="task in challenge.tasks" :key="task._id" class="lg:flex justify-between w-full odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
                  <div class="flex justify-between mr-3 mb-3 lg:mb-0">
                    <span :key="progressChanged">
                      <fa :icon="['fas', 'check-square']" @click="toggleProgressStatus(challenge._id, task._id)" :class="[  task.progress == 'done' ? 'text-green-500' : 'text-gray-500']"
                        class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3" />
                    </span>
                    <span>
                      <nuxt-link :to="'/account/task/' + task._id" class="text-blue-600 hover:text-blue-800">
                        {{ task.title.substring(0, 20 ) }}<span v-if="task.title.length > 20">...</span>
                      </nuxt-link>
                      <span class="lg:hidden text-gray-600">
                        ({{ $t('duration') }}: {{ task.duration }} {{ $tc('days', task.duration != 1 ? 0 : 1)}})
                      </span>
                    </span>
                  </div>
                  <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ task.duration }}
                    {{ $tc('days', task.duration != 1 ? 0 : 1)}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      challenge: {},
      progressChanged: 0,
      showtasks: false
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/`+this.challengeId.trim()).then(res => {
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
  methods: {
    back: function() {
      window.history.back()
    },
    toggleProgressStatus(challengeId, taskId) {
      this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/task/progress`, {
        challenge_id: challengeId,
        task_id: taskId
      }).then(res => {
        console.log(this.$t(res.message))

        const taskIndex = this.challenge.tasks.findIndex(task => task._id === taskId)

        if (taskIndex >= 0) {
          let task = this.challenge.tasks[taskIndex]
          task['progress'] = res.progress

          this.$set(this.challenge.tasks, taskIndex, task)
          this.progressChanged += 1
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toggleShowTasks() {
      this.showtasks = !this.showtasks
    }
  }
}
</script>
