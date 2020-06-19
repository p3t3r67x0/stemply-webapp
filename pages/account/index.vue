<template>
<div class="container mx-auto relative">
  <loading-component v-if="loadingIndicator" />
  <challengeModal v-if="showModal" @clicked="toggleChallengeModal" v-bind:challenge="modalChallenge" />
  <requestChallenge v-if="showRequestModal" @clicked="toggleRequestModal" v-bind:userchallenges="userchallenges" />
  <div v-if="!loadingIndicator" class="mx-3 lg:mx-0">
    <div v-if="!landing && challenges.length === 0" class="text-center">
      <h3 class="text-xl lg:text-2xl mb-2">{{ $t('nochallenge') }}</h3>
      <p class="text-xl text-gray-800">{{ $t('nochallengesupport') }}</p>
    </div>
    <div v-if="landing && challenges.length === 0">
      <h3 class="text-xl lg:text-2xl mb-2">{{ landing.title }}</h3>
      <div class="bg-white rounded-lg p-3">
        <vue-markdown-plus class="markdown text-gray-800" :source="landing.content" />
      </div>
    </div>
    <div class="flex justify-between mb-3">
      <h2 v-if="challenges.length > 0" class="text-xl lg:text-2xl lg:font-medium">Subscribed challenges</h2>
      <span>
        <button @click="toggleRequestModal" class="bg-indigo-500 hover:bg-indigo-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Other challenges</button>
      </span>
    </div>
    <ul v-if="challenges.length > 0" class="container mx-auto flex flex-wrap">
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
            <h2 class="text-xl font-bold border-b pb-3 mb-4">{{ $tc('currentTasks', challenges.length > 1 ? 0 : 1)}}</h2>
            <ul>
              <li v-for="task in challenge.tasks" :key="task._id" class="lg:flex justify-between w-full odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
                <div class="lg:flex justify-between mr-3 mb-3 lg:mb-0">
                  <span :key="progressChanged">
                    <fa :icon="['fas', 'check-square']" @click="toggleProgressStatus(challenge._id, task._id)" :class="[  task.progress == 'done' ? 'text-green-500' : 'text-gray-500']"
                      class="inline-block cursor-pointer text-xl lg:text-2xl w-5 mr-3" />
                  </span>
                  <span>
                    <nuxt-link :to="'/account/task/' + task._id" class="text-blue-600 hover:text-blue-800">
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
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'
import LoadingComponent from '@/components/loading'
import requestChallenge from '@/components/requestChallenge'
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
      showRequestModal: false,
      showModal: false,
      landing: {},
      requests: []
    }
  },
  created() {
    this.$store.commit('updateLoadingIndicator', true)

    this.$axios.$get(`${process.env.API_URL}/api/v1/user/challenge`).then(res => {
      this.challenges = res.message
      this.$store.commit('updateLoadingIndicator', false)
    }).catch(error => {
      this.fetchLandingPage()

      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })

    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/requests`).then(res => {
      res.message.forEach(request => {
        this.requests.push({
          _id: request.cid
        })
      })
    })
  },
  components: {
    VueMarkdownPlus,
    LoadingComponent,
    requestChallenge,
    challengeModal
  },
  computed: {
    loadingIndicator() {
      return this.$store.state.loading
    },
    userchallenges() {
      return this.challenges.concat(this.requests)
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
    toggleRequestModal() {
      if (this.showRequestModal) {
        this.requests = []
        this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/requests`).then(res => {
          res.message.forEach(request => this.requests.push({
            _id: request.cid
          }))
        })
      }
      this.showRequestModal = !this.showRequestModal
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
