<template>
<div class="p-3">
  <div class="container bg-white rounded-lg mx-auto p-3">
    <h1 class="text-2xl lg:text-4xl font-medium mb-2">Challenge</h1>
    <p v-if="showResponse" class="text-green-500 lg:text-lg mb-3">{{ response }}</p>
    <form ref="contactForm" @submit.prevent="submitForm" class="w-full">
      <div class="w-full mb-6">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
          Title
        </label>
        <input name="title" v-model="challenge.title" v-bind:class="{'border-red-500': errors.title}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="title"
          type="text" placeholder="Learn to use the new media">
        <p v-if="errors.title" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <div class="w-full mb-6">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
          Duration
        </label>
        <input name="duration" v-model="challenge.duration" v-bind:class="{'border-red-500': errors.duration}"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="duration" type="duration" placeholder="Valid for three weeks">
        <p v-if="errors.duration" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <div class="w-full mb-6">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
          Content
        </label>
        <textarea name="duration" v-model="challenge.content" v-bind:class="{'border-red-500': errors.content}"
          class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="content" type="content"
          placeholder="Describe your chalenge here"></textarea>
        <p v-if="errors.content" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <p class="text-right">
        <nuxt-link to="/account/edit" class="inline-block bg-gray-500 hover:bg-gray-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2 mr-2">
          Back
        </nuxt-link>
        <button class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2" type="submit">
          Save
        </button>
      </p>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      response: '',
      showResponse: false,
      challenge: {
        title: '',
        duration: '',
        content: ''
      },
      errors: {
        title: false,
        duration: false,
        content: false
      }
    }
  },
  computed: {
    challengeId() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/detail', {
        'id': this.challengeId.trim()
      }).then(res => {
        if (res.message[0]) {
          this.challenge = res.message[0]
        }
      }).catch(error => {
        console.log(error.config)
      })
    }
  },
  watch: {
    'challenge.content': function() {
      if (this.challenge.content.trim() !== '') {
        if (this.challenge.content.trim().length > 7) {
          this.errors.content = false
        } else {
          this.errors.content = true
        }
      }
    },
    'challenge.title': function() {
      if (this.challenge.title.trim() !== '') {
        if (this.challenge.title.trim().length > 7) {
          this.errors.title = false
        } else {
          this.errors.title = true
        }
      }
    },
    'challenge.duration': function() {
      if (this.challenge.duration > 0) {
        this.errors.duration = false
      } else {
        this.errors.duration = true
      }
    }
  },
  middleware: 'auth',
  methods: {
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.challenge.content) {
        this.errors.content = true
      }

      if (!this.challenge.title) {
        this.errors.title = true
      }

      if (!this.challenge.duration) {
        this.errors.duration = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.challengeId) {
          this.$axios.$put(process.env.API_URL + '/api/v1/challenge/detail', {
            'id': this.challengeId.trim(),
            'title': this.challenge.title.trim(),
            'duration': this.challenge.duration.trim(),
            'content': this.challenge.content.trim()
          }).then(res => {
            this.response = res.message
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              console.log(error.response.data)
            } else {
              console.log(error.message)
            }
          })
        } else {
          this.$axios.post(process.env.API_URL + '/api/v1/challenge', {
            'title': this.challenge.title.trim(),
            'duration': this.challenge.duration.trim(),
            'content': this.challenge.content.trim()
          }).then(res => {
            this.response = res.data.message
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              console.log(error.response.data)
            } else {
              console.log(error.message)
            }
          })
        }
      }
    }
  }
}
</script>
