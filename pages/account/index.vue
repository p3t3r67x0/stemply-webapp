<template>
<div class="container mx-auto bg-white rounded-lg p-3 mt-3">
  <h1 class="text-2xl font-bold mb-2">Personal Dashboard</h1>
  <hr style="width: 365px">
  <div>
    <h2 v-if="challenges.length != 0" class="text-xl font-bold mb-2 text-center my-4">Your current challenge:</h2>
    <hr style="width: 100px" class="mx-auto my-4">
  </div>
  <ul class="flex justify-center">
    <div v-for="challenge in challenges">
      <div class="max-w-sm rounded overflow-hidden shadow-lg" v-if="challenges[showing]._id === challenge._id || showall">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ challenge.title }}</div>
          <p class="text-gray-700 text-base">
            {{ challenge.content }}
          </p>
        </div>
        <hr>
        <div class="px-6 py-4 flex" v-if="!showall">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 mr-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === 0}" :disabled="showing === 0" v-on:click="showing-=1">Previous</button>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ml-auto" :class="{ 'opacity-50 cursor-not-allowed': showing === challenges.length-1}" :disabled="showing === challenges.length-1" v-on:click="showing+=1">Next</button>
        </div>
      </div>
    </div>
  </ul>
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
      showall: false
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/user').then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error.response.data)
    })
  },
  methods: {}
}
</script>
