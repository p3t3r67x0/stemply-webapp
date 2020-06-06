<template>
<div class="container mx-auto">


<challengeModal v-if="showChallengeModal && tasksLoaded" v-on:clicked="toggleChallengeModal" v-bind:challenge="modalChallenge"/>


  <div class="mx-3 lg:mx-0">
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
    <h2 v-if="challenges.length > 0" class="text-xl lg:text-2xl lg:font-semibold mb-3">My challenges</h2>
    <ul v-if="challenges.length > 0" class="container mx-auto flex flex-wrap">
      <li v-for="challenge, key in challenges" :key="challenge._id" v-if="challenges[showing]._id === challenge._id || showall" class="w-full bg-white rounded overflow-hidden shadow border mb-6">
        <div class="lg:flex">
          <div class="w-full lg:w-1/3 border-r">
            <div class="block group p-4" v-on:click="showChallenge(key)">
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
            <ul :key="tasksLoaded">
              <li v-for="task in challenge.tasks" :key="task._id" class="lg:flex justify-between w-full odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
                <div class="flex justify-between mr-3 mb-3 lg:mb-0">
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
        <hr>
        <div v-if="!showall && challenges.length > 1" class="flex justify-center m-3">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 justify-end" :class="{ 'opacity-50 cursor-not-allowed': showing === 0}" :disabled="showing === 0" v-on:click="showing-=1">{{ $t('previous') }}</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ml-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === challenges.length-1}" :disabled="showing === challenges.length-1"
            v-on:click="showing+=1">{{ $t('next') }}</button>
        </div>
      </li>
    </ul>
    <div v-if="challenges.length > 1" class="mb-2">
      <div class="form-switch inline-block align-right ml-auto">
        <input v-model="showall" id="showallswitch" type="checkbox" name="showallswitch" class="form-switch-checkbox" />
        <label for="showallswitch" class="form-switch-label">{{ $t('showall') }}</label>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'
import challengeModal from '@/components/challengeModal'

export default {
  data() {
    return {
      user: {},
      tasks: [],
      challenges: [],
      showing: 0,
      showall: false,
      modalChallenge: [],
      excerptLength: 165,
      progressChanged: false,
      showChallengeModal: true,
      tasksLoaded: 0,
      landing: {}
    }
  },
  created() {
    if (this.challenges.length === 0) {
      this.$axios.$get(process.env.API_URL + '/api/v1/landing').then(res => {
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
    }

    this.$axios.$get(process.env.API_URL + '/api/v1/user').then(res => {
      this.user = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })

    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/subscription').then(res => {
      res.message.forEach(challenge => {
        this.challenges.push({
          _id: challenge._id,
          toDate: challenge.to,
          fromDate: challenge.from,
          duration: challenge.duration,
          content: challenge.content,
          title: challenge.title
        })
      })
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })

    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/task').then(res => {
      this.tasks = res.message

      res.message.forEach(challenge => {
        const challengeIndex = this.challenges.findIndex(c => c._id === challenge._id)

        if (challengeIndex >= 0) {
          const tasks = []

          challenge.tasks.forEach(task => {
            tasks.push({
              _id: task._id,
              toDate: task.to,
              fromDate: task.from,
              duration: task.duration,
              title: task.title
            })
          })

          this.challenges[challengeIndex]['tasks'] = tasks
          this.tasksLoaded += 1
        }

        challenge.tasks.forEach((task, index) => {
          if (this.user.hasOwnProperty('progress')) {
            const filter = this.user.progress.filter(progress => progress.tid === task._id)

            if (filter.length > 0) {
              this.challenges[challengeIndex].tasks[index].progress = 'done'
            }
          }
        })
      })
    }).catch(error => {
      console.log(error)
    })
  },
  components: {
    VueMarkdownPlus,
    challengeModal
  },
  middleware: 'auth',
  methods: {
    toggleProgressStatus(challengeId, taskId) {
      this.$axios.$put(process.env.API_URL + '/api/v1/challenge/task/progress', {
        challenge_id: challengeId,
        task_id: taskId
      }).then(res => {
        console.log(this.$t(res.message))

        const challengeIndex = this.challenges.findIndex(challenge => challenge._id === challengeId)
        const taskIndex = this.challenges[challengeIndex].tasks.findIndex(task => task._id === taskId)

        if (taskIndex) {
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
      this.showChallengeModal = !this.showChallengeModal
    },
    showChallenge(key) {
      this.modalChallenge = this.challenges[key]
      this.showChallengeModal = true
    }
  }
}
</script>
<style>
  .modal {
    transition: opacity 0.25s ease;
  }
  body.modal-active {
    overflow-x: hidden;
    overflow-y: visible !important;
  }
</style>
