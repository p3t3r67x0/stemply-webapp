<template>
<ul class="container mx-auto mt-3">
  <li v-for="challenge in challenges" class="bg-white rounded-lg p-3 mb-6">
    <div class="flex justify-betweeen mb-1">
      <h3 class="w-full md:w-8/12 text-xl font-bold">{{ challenge.title }}</h3>
    </div>
    <span class="inline-block bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-3 py-1 mb-3">{{ secondsToDays(challenge.duration) }}</span>
    <p class="text-lg mb-6">{{ challenge.content }}</p>
    <h4 class="w-full md:w-8/12 text-xl mb-1">Manage user subscription</h4>
    <ul>
      <li v-for="user in users" class="odd:bg-gray-200 p-2">
        <div class="flex justify-between">
          <div>
            {{ user.email }}
          </div>
          <div class="text-right">
            <button type="button" @click="toggleSubscribe(challenge._id, user._id)" :class="[matchChallenge(challenge._id, user.challenges) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600']"
              class="focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">{{ matchChallenge(challenge._id, user.challenges) ? 'Unsubscribe' : 'Subscribe'}}</button>
          </div>
        </div>
      </li>
    </ul>
  </li>
</ul>
</template>

<script>
export default {
  data() {
    return {
      challenges: null,
      users: null
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge').then(res => {
      console.log(res)
      this.challenges = res.message
    }).catch(error => {
      console.log(error.response.data)
    })

    this.fetchUsers()
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  middleware: 'auth',
  methods: {
    toggleSubscribe(challengeId, userId) {
      this.$axios.$put(process.env.API_URL + '/api/v1/challenge/subscription', {
        challenge_id: challengeId,
        user_id: userId
      }).then(res => {
        this.fetchUsers()
      }).catch(error => {
        console.log(error.response.data)
      })
    },
    fetchUsers() {
      this.$axios.$get(process.env.API_URL + '/api/v1/user').then(res => {
        this.users = res.message
      }).catch(error => {
        console.log(error.response.data)
      })
    },
    matchChallenge(challengeId, challenges) {
      return challenges.includes(challengeId)
    },
    secondsToDays(seconds) {
      const days = Math.round(seconds / 3600 / 24)

      if (days <= 1 && days != 0) {
        return `${days} day`
      } else {
        return `${days} days`
      }
    }
  }
}
</script>
