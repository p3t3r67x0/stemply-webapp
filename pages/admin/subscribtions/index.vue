<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-medium mb-4">{{ $t('navigation.subscription') }}</h1>
    <ul>
      <li v-for="challenge in challenges" class="bg-white rounded-lg p-3 mb-6">
        <h3 class="w-full md:w-8/12 text-lg lg:text-xl font-semibold mb-3">{{ challenge.title }}</h3>
        <ul>
          <li v-for="user in challenge.users" class="odd:bg-gray-200 even:bg-gray-100 p-2">
            <div class="lg:flex justify-between">
              <div class="break-all mb-2 lg:mb-0">
                {{ user.email }} <span class="text-gray-500">({{ user.name }})</span>
              </div>
              <div class="lg:text-right">
                <button type="button" @click="toggleSubscribe(challenge._id, user._id)" :class="matchChallengeClass(user)"
                  class="focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">{{ matchChallenge(user) }}</button>
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
    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/subscription/list`).then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error)
    })
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
        this.challenges = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    matchChallenge(user) {
      if (!user.subscribed && !user.requested) {
        return 'Subscribe'
      }

      if (user.requested) {
        return 'Approve'
      }

      if (user.subscribed) {
        return 'Unsubscribe'
      }
    },
    matchChallengeClass(user) {
      if (!user.subscribed && !user.requested) {
        return 'bg-green-500 hover:bg-green-600'
      }

      if (user.requested) {
        return 'bg-indigo-500 hover:bg-indigo-600'
      }

      if (user.subscribed) {
        return 'bg-red-500 hover:bg-red-600'
      }
    }
  }
}
</script>
