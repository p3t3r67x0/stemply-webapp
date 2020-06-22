<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-medium mb-4">{{ $t('navigation.subscription') }}</h1>
    <ul>
      <li v-for="challenge in challenges" class="bg-white rounded-lg p-3 mb-6">
        <h3 class="w-full md:w-8/12 text-lg lg:text-xl font-semibold mb-3">{{ challenge.title }}</h3>
        <ul>
          <li v-for="user in users" class="odd:bg-gray-200 even:bg-gray-100 p-2">
            <div class="lg:flex justify-between">
              <div class="break-all mb-2 lg:mb-0">
                {{ user.email }}
              </div>
              <div class="lg:text-right">
                <button type="button" @click="toggleSubscribe(challenge._id, user._id)" :class="[matchChallenge(challenge._id, user) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600']"
                  class="focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">{{ matchChallenge(challenge._id, user) ? 'Unsubscribe' : 'Subscribe'}}</button>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>
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
    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/list`).then(res => {
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
      this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/subscription`, {
        cid: challengeId,
        uid: userId
      }).then(res => {
        this.fetchUsers()
      }).catch(error => {
        console.log(error.response.data)
      })
    },
    fetchUsers() {
      this.$axios.$get(`${process.env.API_URL}/api/v1/user/list`).then(res => {
        this.users = res.message
      }).catch(error => {
        console.log(error.response.data)
      })
    },
    matchChallenge(challengeId, user) {
      if (!user.hasOwnProperty('challenges')) {
        return false
      }

      return user.challenges.includes(challengeId)
    }
  }
}
</script>
