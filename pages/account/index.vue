<template>
<div class="container mx-auto bg-white rounded-lg p-12 mt-3">
  <h1 class="text-2xl font-bold mb-2">{{ $t('navigation.dashboard')}}</h1>
  <hr style="width: 365px">
  <div>
    <h2 class="text-xl font-bold mb-2 text-center my-4">{{ $tc('currentchallenges', challenges.length > 1 ? 0 : 1)}}:</h2>
    <hr style="width: 100px" class="mx-auto my-4">
  </div>
  <div class="container my-12 mx-auto px-4 md:px-12">
    <div class="flex flex-wrap -mx-1 lg:-mx-4" :class="{ 'flex justify-center' : !showall }">
      <div class="my-1 lg:my-2 rounded overflow-hidden shadow-lg border m-2 " v-for="challenge in challenges" :key="challenge._id" v-if="challenges[showing]._id === challenge._id || showall">
        <div class="flex">
          <div class="container hover:border hover:shadow-2xl w-1/3 border-r cursor-pointer">
            <a :href="'account/detail/' + challenge._id" class="group">
              <img class="w-full group-hover:opacity-75" src="https://images.unsplash.com/photo-1590589195374-163308c534ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="Forest">
              <div class="px-6 py-4">
                <div class="group-hover:text-gray-700 font-bold text-xl mb-2">{{ challenge.title }}</div>
                <p class="text-gray-700 group-hover:text-gray-600 text-base">
                  <span v-if="challenge.content.length > excerptlength">
                    <vue-markdown-plus class="markdown" :source="challenge.content.substring(0, excerptlength)" />...</span>
                  <span v-else>
                    <vue-markdown-plus class="markdown" :source="challenge.content" /></span>
                </p>
              </div>
              <div class="px-6 py-4">
                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenge.duration / 86400 }} {{ $tc('days', challenge.duration > 86400 ? 0 : 1)}}</span>
              </div>
            </a>
          </div>
          <div class="container w-2/3 py-2 px-6">
            <div class="mb-8">
              <h2 class="text-xl text-center font-bold">Tasks</h2>
              <hr>
            </div>
            <ul :key="tasksLoaded">
              <a href="/" v-for="task in challenge.tasks" :key="task._id">
                <div class="m-2 py-3 px-2 border flex hover:shadow-lg">
                    <div class="mr-3">
                      <fa :icon="['fas', 'check-square']" class="inline-block text-2xl w-5 mr-3" :class="[ task._id == task._id ? 'text-green-500' : 'text-gray-500']" />
                    </div>
                    <div class="">{{ task.content.substring(0, excerptlength / 4 ) }}<span v-if="task.content.length > excerptlength / 3">...</span></div>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ Math.round(task.duration / 8640) / 10 }} {{ $tc('days', task.duration != 86400 ? 0 : 1)}}</span>
                </div>
              </a>
            </ul>
          </div>
        </div>
        <hr>
        <div class="px-6 py-4 flex justify-center" v-if="!showall">
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
      challenges: [],
      showing: 0,
      showall: false,
      excerptlength: 200,
      tasksLoaded: 0
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/subscription').then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error.response.data)
    })
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/task').then(res => {
      res.message.forEach(task => {
        let index = this.challenges.findIndex(challenge => challenge._id === task._id)
        this.challenges[index]['tasks'] = task.tasks,
          this.tasksLoaded += 1
      })
    }).catch(error => {
      console.log(error)
    })
  },
  components: {
    VueMarkdownPlus
  },
  middleware: 'auth',
  methods: {}
}
</script>
