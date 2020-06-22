<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0 mb-8">
    <div class="flex justify-between mb-3">
      <h2 class="text-xl lg:text-2xl lg:font-medium">My challenge subscriptions</h2>
      <div>
        <nuxt-link :to="localePath('/account')" class="inline-block bg-indigo-500 hover:bg-indigo-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Subscribed challenges</nuxt-link>
      </div>
    </div>
    <div v-if="challenges.length === 0" class="bg-white rounded p-3 mb-6">
      <p class="text-xl text-gray-800">Bitte wähle mindestens einen oder mehrere Kurse aus. Sobald Du mindestens einen Kurs ausgewählt hast wird der Support dich bei erfolgreicher Registrierung in den Kurs zuteilen.</p>
    </div>
    <ul class="bg-white rounded p-3">
      <li v-for="challenge, index in challenges" :key="challenge._id" class="lg:flex justify-between width odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
        <div class="lg:w-8/12 mb-3 lg:mb-0">
          <span>
            {{ handleSubstring(challenge.title) }}
          </span>
          <span class="lg:hidden text-gray-600">
            ({{ $t('duration') }}: {{ challenge.duration }} {{ $tc('days', challenge.duration != 1 ? 0 : 1)}})
          </span>
        </div>
        <div class="lg:w-4/12 text-right">
          <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenge.duration }}
            {{ $tc('days', challenge.duration != 1 ? 0 : 1)}}</span>
          <button type="button" @click="toggleSubscription(challenge._id)" :class="matchChallengeClass(challenge.user)"
            class="w-full sm:w-auto focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">{{ matchChallenge(challenge.user) }}</button>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      challenges: [],
      excerptLength: 55
    }
  },
  components: {
    VueMarkdownPlus
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/request/list`).then(res => {
      this.challenges = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })
  },
  middleware: 'auth',
  methods: {
    toggleSubscription(challengeId) {
      this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/request/${challengeId}`).then(res => {
        this.challenges = res.data
      }).catch(error => {
        console.log(error.response.data)
      })
    },
    handleSubstring(title) {
      if (title.length > this.excerptLength) {
        return `${title.substring(0, this.excerptLength)}...`
      }

      return title
    },
    matchChallenge(user) {
      if (!user.subscribed && !user.requested) {
        return 'Request access'
      }

      if (user.requested) {
        return 'Delete request'
      }

      if (user.subscribed) {
        return 'Unsuscribe'
      }
    },
    matchChallengeClass(user) {
      if (!user.subscribed && !user.requested) {
        return 'bg-green-500 hover:bg-green-600'
      }

      if (user.requested) {
        return 'bg-red-500 hover:bg-red-600'
      }

      if (user.subscribed) {
        return 'bg-indigo-500 hover:bg-indigo-600'
      }
    }
  }
}
</script>
