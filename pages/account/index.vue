<template>
<div class="container mx-auto relative">
  <challengeModal v-if="showModal" @clicked="toggleChallengeModal" v-bind:challenge="modalChallenge" />

  <div v-if="!loadingIndicator" class="mx-3 lg:mx-0">
    <loading-component v-if="loadingIndicator" />

    <div>
      <div class="flex justify-between mb-3">
        <h2 class="text-xl lg:text-2xl lg:font-medium mr-3">Subscribed challenges</h2>
        <span>
          <nuxt-link :to="localePath('/account/subscriptions')" class="inline-block bg-indigo-500 hover:bg-indigo-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Other challenges</nuxt-link>
        </span>
      </div>
      <ul class="flex flex-wrap">
        <li v-for="challenge, key in challenges" :key="challenge._id" class="w-full bg-white rounded overflow-hidden shadow border mb-6">
          <div class="lg:flex">
            <div class="w-full lg:w-1/3 border-r">
              <div class="block group p-4" @click="showChallenge(key)">
                <div class="group-hover:text-gray-700 font-bold text-xl mb-2">{{ challenge.title }}</div>
                <p class="text-gray-700 group-hover:text-gray-600 text-base mb-4">
                  <span v-if="challenge.content.length > excerptLength">
                    <vue-markdown-plus class="markdown" :source="challenge.content.substring(0, excerptLength * 2)" />...</span>
                  <span v-else>
                    <vue-markdown-plus class="markdown" :source="challenge.content" />
                  </span>
                </p>
                <span class="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{{ $t('duration') }}: {{ challenge.duration }} {{ $tc('days', challenge.duration != 1 ? 0 : 1)}}</span>
              </div>
            </div>
            <div class="w-full lg:w-2/3 p-4">
              <h2 class="text-xl font-bold border-b pb-3 mb-4">{{ $tc('currentTasks', challenges.length > 1 ? 1 : 0)}}</h2>
              <ul>
                <li v-for="task in challenge.tasks" :key="task._id" class="lg:flex justify-between w-full odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
                  <div class="lg:flex justify-between mr-3 mb-3 lg:mb-0">
                    <span :key="progressChanged">
                      <fa :icon="['fas', 'check-square']" @click="toggleProgressStatus(challenge._id, task._id)" :class="[  task.progress == 'done' ? 'text-green-500' : 'text-gray-500']"
                        class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3" />
                    </span>
                    <span>
                      <nuxt-link :to="localePath('/account/task/' + task._id)" class="text-blue-600 hover:text-blue-800">
                        {{ task.title.substring(0, excerptLength / 4 ) }}<span v-if="task.title.length > excerptLength / 4">...</span>
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
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'
import LoadingComponent from '@/components/loading'
import RequestComponent from '@/components/request'
import challengeModal from '@/components/challengeModal'

export default {
  data() {
    return {
      user: {},
      tasks: [],
      challenges: [],
      modalChallenge: [],
      excerptLength: 165,
      progressChanged: false,
      showModal: false,
      landing: {}
    }
  },
  created() {
    this.$store.commit('updateLoadingIndicator', true)

    this.$axios.$get(`${process.env.API_URL}/api/v1/user/challenge`).then(res => {
      this.challenges = res.message
      this.$store.commit('updateLoadingIndicator', false)
    }).catch(error => {
      this.$store.commit('updateLoadingIndicator', false)
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })
  },
  components: {
    VueMarkdownPlus,
    RequestComponent,
    LoadingComponent,
    challengeModal
  },
  computed: {
    loadingIndicator() {
      return this.$store.state.loading
    }
  },
  middleware: 'auth',
  methods: {
    fetchLandingPage() {
      this.$axios.$get(`${process.env.API_URL}/api/v1/landing`).then(res => {
        if (res.message.hasOwnProperty('content')) {
          this.landing = res.message
        }
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    },
    toggleProgressStatus(challengeId, taskId) {
      this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/task/progress`, {
        challenge_id: challengeId,
        task_id: taskId
      }).then(res => {
        const challengeIndex = this.challenges.findIndex(challenge => challenge._id === challengeId)
        const taskIndex = this.challenges[challengeIndex].tasks.findIndex(task => task._id === taskId)

        if (taskIndex >= 0) {
          let task = this.challenges[challengeIndex].tasks[taskIndex]
          task['progress'] = res.progress

          this.$set(this.challenges[challengeIndex].tasks, taskIndex, task)
          this.progressChanged = !this.progressChanged
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toggleChallengeModal() {
      this.showModal = !this.showModal
    },
    showChallenge(key) {
      this.modalChallenge = this.challenges[key]
      this.showModal = true
    }
  }
}
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
