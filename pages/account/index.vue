<template>
<div class="container mx-auto">
  <h2 class="text-2xl font-bold mb-2">{{ $tc('currentchallenges', challenges.length > 1 ? 0 : 1)}}:</h2>
  <div class="container mx-auto">
    <div class="flex flex-wrap" :class="{ 'flex justify-center' : !showall }">
      <div v-for="challenge in challenges" :key="challenge._id" v-if="challenges[showing]._id === challenge._id || showall" class="bg-white rounded overflow-hidden shadow-lg border mb-6">
        <div class="flex">
          <div class="container hover:border hover:shadow-2xl w-1/3 border-r cursor-pointer">
            <nuxt-link :to="'account/detail/' + challenge._id" class="group">
              <img class="w-full group-hover:opacity-75" src="https://images.unsplash.com/photo-1590589195374-163308c534ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="Forest">
              <div class="px-6 py-4">
                <div class="group-hover:text-gray-700 font-bold text-xl mb-2">{{ challenge.title }}</div>
                <p class="text-gray-700 group-hover:text-gray-600 text-base">
                  <span v-if="challenge.content.length > excerptlength">
                    <vue-markdown-plus class="markdown" :source="challenge.content.substring(0, excerptlength)" />...</span>
                  <span v-else>
                    <vue-markdown-plus class="markdown" :source="challenge.content" />
                  </span>
                </p>
              </div>
              <div class="px-6 py-4">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenge.duration / 86400 }} {{ $tc('days', challenge.duration > 86400 ? 0 : 1)}}</span>
              </div>
            </nuxt-link>
          </div>
          <div class="container w-2/3 py-2 px-6">
            <div class="mb-8">
              <h2 class="text-xl text-center font-bold">Tasks</h2>
              <hr>
            </div>
            <ul :key="tasksLoaded">
              <li v-for="task in challenge.tasks" :key="task._id" class="flex justify-between hover:shadow-lg px-2 py-3 m-2">
                <div class="flex justify-between mr-3">
                  <span :key="progressChanged">
                    <fa :icon="['fas', 'check-square']" @click="toggleProgressStatus(challenge._id, task._id)" :class="[  task.progress == 'done' ? 'text-green-500' : 'text-gray-500']" class="inline-block cursor-pointer text-2xl w-5 mr-3" />
                  </span>
                  <div class="">{{ task.content.substring(0, excerptlength / 4 ) }}<span v-if="task.content.length > excerptlength / 3">...</span></div>
                </div>
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ Math.round(task.duration / 8640) / 10 }} {{ $tc('days', task.duration != 86400 ? 0 : 1)}}</span>
              </li>
            </ul>
          </div>
        </div>
        <hr>
        <div v-if="!showall" class="flex justify-center m-3">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 justify-end" :class="{ 'opacity-50 cursor-not-allowed': showing === 0}" :disabled="showing === 0" v-on:click="showing-=1">{{ $t('previous') }}</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ml-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === challenges.length-1}" :disabled="showing === challenges.length-1"
            v-on:click="showing+=1">{{ $t('next') }}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="mb-2">
    <div class="form-switch inline-block align-right ml-auto">
      <input type="checkbox" name="showallswitch" v-model="showall" id="showallswitch" class="form-switch-checkbox" />
      <label class="form-switch-label" for="showallswitch">{{ $t('showall') }}</label>
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      user: {},
      tasks: [],
      challenges: [],
      showing: 0,
      showall: false,
      excerptlength: 200,
      tasksLoaded: 0,
      progressChanged: false
    }
  },
  mounted() {
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
      this.challenges = res.message
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
          this.challenges[challengeIndex]['tasks'] = challenge.tasks
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
    VueMarkdownPlus
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
    }
  }
}
</script>
