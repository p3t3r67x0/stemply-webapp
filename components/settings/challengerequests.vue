<template>
<div>
  <h2 class="text-2xl mb-4">Requested Challenges</h2>
  <li v-for="request, key in requests" :key="request._id" class="lg:flex justify-between width odd:bg-gray-100 even:bg-gray-200 px-2 py-3" v-if="loaded && challenges[request._id]">
    <div class="flex justify-between mr-3 mb-3 lg:mb-0">
      <span>
        {{ challenges[request._id].title }}
        <span class="lg:hidden text-gray-600">
          ({{ $t('duration') }}: {{ challenges[request._id].duration }} {{ $tc('days', challenges[request._id].duration != 1 ? 0 : 1)}})
        </span>
      </span>
    </div>
    <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenges[request._id].duration }}
      {{ $tc('days', challenges[request._id].duration != 1 ? 0 : 1)}}</span>
    <div class="-m-1">
      <button class="px-4 bg-indigo-500 rounded-lg p-1 text-white hover:bg-indigo-400" v-on:click="deleteRequest(request._id, key)">Delete request</button>
    </div>
  </li>
</div>
</template>

<script>
export default {
  data() {
    return {
      requests: [],
      challenges: {},
      loaded: false
    }
  },
  components: {},
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/requests`).then(res => {
      this.requests = res.message
      this.requests.forEach(request => {
        this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/detail`, {
          id: request.cid
        }).then(res => {
          this.challenges[request._id] = res.message
          this.loaded = true
        })
      })
    })
  },
  methods: {
    deleteRequest(id, key) {
      this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/request/delete`, {id: id}).then(res => {
        console.log(res.message)
      })
      this.requests.splice(key, 1)
    }
  }
}
</script>
