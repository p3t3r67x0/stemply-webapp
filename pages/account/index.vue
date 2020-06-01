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
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-2 lg:px-2 lg:w-1/3" v-for="challenge in challenges" v-if="challenges[showing]._id === challenge._id || showall">
        <div class="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer hover:border m-2 container">
          <a :href="'account/detail/' + challenge._id" class="group">
            <img class="w-full group-hover:opacity-75" src="https://images.unsplash.com/photo-1590589195374-163308c534ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="Forest">
            <div class="px-6 py-4">
              <div class="group-hover:text-gray-700 font-bold text-xl mb-2">{{ challenge.title }}</div>
              <p class="text-gray-700 group-hover:text-gray-600 text-base">
                <span v-if="challenge.content.length > excerptlength">{{ challenge.content.substring(0, excerptlength) }}...</span>
                <span v-else>{{ challenge.content }}</span>
              </p>
            </div>
            <hr>
            <div class="px-6 py-4">
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenge.duration / 3600 / 24}} {{ $tc('days', challenge.duration > 86400 ? 0 : 1)}}</span>
            </div>
          </a>
          <div class="px-6 py-4 flex" v-if="!showall">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mr-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === 0}" :disabled="showing === 0" v-on:click="showing-=1">Previous</button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ml-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === challenges.length-1}" :disabled="showing === challenges.length-1"
              v-on:click="showing+=1">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mb-2">
    <div class="form-switch inline-block align-right ml-auto">
      <input type="checkbox" name="showallswitch" v-model="showall" id="showallswitch" class="form-switch-checkbox" />
      <label class="form-switch-label" for="showallswitch">Show all challenges</label>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      challenges: [],
      showing: 0,
      showall: false,
      excerptlength: 200
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/subscription').then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error.response.data)
    })
  },
  middleware: 'auth',
  methods: {}
}
</script>
