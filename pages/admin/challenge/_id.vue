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
      <div class="sm:flex w-full mb-6">
        <div class="sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 md:mb-0 sm:mr-4">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
            From
          </label>
          <client-only>
            <date-picker v-model="challenge.fromDate" format="DD-MM-YYYY" valueType="DD-MM-YYYY" :disabled-date="notBeforeToday" class="w-full focus:outline-none" placeholder="DD-MM-YYYY"></date-picker>
          </client-only>
          <p v-if="errors.fromDate" class="text-red-500 text-xs italic">Please fill out this field.</p>
        </div>
        <div class="sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="toDate">
            To
          </label>
          <client-only>
            <date-picker v-model="challenge.toDate" format="DD-MM-YYYY" valueType="DD-MM-YYYY" :disabled-date="notBeforeToday" class="w-full focus:outline-none" placeholder="DD-MM-YYYY"></date-picker>
          </client-only>
          <p v-if="errors.toDate" class="text-red-500 text-xs italic">Please fill out this field.</p>
        </div>
      </div>
      <div class="w-full mb-6">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          Content
        </label>
        <textarea name="fromDate" v-model="challenge.content" v-bind:class="{'border-red-500': errors.content}"
          class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="content" type="content"
          placeholder="Describe your chalenge here"></textarea>
        <p v-if="errors.content" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <p class="text-right">
        <nuxt-link to="/admin" class="inline-block bg-gray-500 hover:bg-gray-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2 mr-2">
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
        content: '',
        fromDate: '',
        toDate: '',
      },
      errors: {
        title: false,
        content: false,
        fromDate: false,
        toDate: false,
      }
    }
  },
  computed: {
    challengeId() {
      return this.$route.params.id
    },
    yesterday() {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      return yesterday
    }
  },
  created() {
    if (this.challengeId) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/detail', {
        'id': this.challengeId.trim()
      }).then(res => {
        this.challenge['_id'] = res.message._id
        this.challenge['toDate'] = res.message.to
        this.challenge['fromDate'] = res.message.from
        this.challenge['content'] = res.message.content
        this.challenge['title'] = res.message.title
      }).catch(error => {
        console.log(error.response.data)
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
    'challenge.fromDate': function() {
      if (this.challenge.fromDate) {
        this.errors.fromDate = false
      } else {
        this.errors.fromDate = true
      }
    },
    'challenge.toDate': function() {
      if (this.challenge.toDate) {
        this.errors.toDate = false
      } else {
        this.errors.toDate = true
      }
    }
  },
  middleware: 'auth',
  methods: {
    notBeforeToday(date) {
      return date < this.yesterday
    },
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.challenge.content) {
        this.errors.content = true
      }

      if (!this.challenge.title) {
        this.errors.title = true
      }

      if (!this.challenge.fromDate) {
        this.errors.fromDate = true
      }

      if (!this.challenge.toDate) {
        this.errors.toDate = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.challengeId) {
          this.$axios.$put(process.env.API_URL + '/api/v1/challenge/detail', {
            id: this.challengeId.trim(),
            title: this.challenge.title.trim(),
            content: this.challenge.content.trim(),
            from_date: this.challenge.fromDate.trim(),
            to_date: this.challenge.toDate.trim()
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
            title: this.challenge.title.trim(),
            content: this.challenge.content.trim(),
            from_date: this.challenge.fromDate.trim(),
            to_date: this.challenge.toDate.trim()
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
