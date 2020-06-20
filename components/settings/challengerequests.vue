<template>
<div>
  <h2 class="text-2xl mb-4">Requested Challenges</h2>
  <ul>
    <li v-for="request, index in requests" :key="request._id" class="lg:flex justify-between width odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
      <div class="flex justify-between mr-3 mb-3 lg:mb-0">
        <span>
          {{ request.challenges.title }}
          <span class="lg:hidden text-gray-600">
            ({{ $t('duration') }}: {{ request.challenges.duration }} {{ $tc('days', request.challenges.duration != 1 ? 0 : 1)}})
          </span>
        </span>
      </div>
      <div class="">
        <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ request.challenges.duration }}
          {{ $tc('days', request.challenges.duration != 1 ? 0 : 1)}}
        </span>
        <button @click="deleteRequest(request._id, index)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      requests: []
    }
  },
  components: {},
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/request/list`).then(res => {
      this.requests = res.message
    })
  },
  methods: {
    deleteRequest(id, index) {
      this.$axios.$delete(`${process.env.API_URL}/api/v1/challenge/request/${id}`).then(res => {
        console.log(res)
        this.requests.splice(index, 1)
      })
    }
  }
}
</script>
