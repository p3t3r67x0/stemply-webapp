<template>
<form ref="contactForm" @submit.prevent="submitForm" class="w-full">
  <p v-if="showResponse" class="text-green-500 lg:text-lg mb-3">{{ response }}</p>
  <div class="w-full mb-6">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
      Title
    </label>
    <input name="title" v-model="landing.title" v-bind:class="{'border-red-500': errors.title}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="title"
      type="text" placeholder="Learn to use the new media">
    <p v-if="errors.title" class="text-red-500 text-xs italic">Please fill out this field.</p>
  </div>
  <div class="w-full mb-6">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
      Content
    </label>
    <textarea name="duration" v-model="landing.content" v-bind:class="{'border-red-500': errors.content}"
      class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="content" type="content"
      placeholder="Describe your chalenge here"></textarea>
    <p v-if="errors.content" class="text-red-500 text-xs italic">Please fill out this field.</p>
  </div>
  <p class="text-right">
    <button class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2" type="submit">
      Save
    </button>
  </p>
</form>
</template>

<script>
export default {
  data() {
    return {
      response: '',
      showResponse: false,
      landing: {
        title: '',
        content: ''
      },
      errors: {
        title: false,
        content: false
      },
      action: null
    }
  },
  watch: {
    'landing.content': function() {
      if (this.landing.content.trim() !== '') {
        if (this.landing.content.trim().length > 7) {
          this.errors.content = false
        } else {
          this.errors.content = true
        }
      }
    },
    'landing.title': function() {
      if (this.landing.title.trim() !== '') {
        if (this.landing.title.trim().length > 7) {
          this.errors.title = false
        } else {
          this.errors.title = true
        }
      }
    }
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/landing`).then(res => {
      if (res.message.hasOwnProperty('content')) {
        this.landing = res.message
        this.action = 'update'
      } else {
        this.action = 'insert'
      }
    }).catch(error => {
      console.log(error.response.data)
    })
  },
  middleware: 'auth',
  methods: {
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.landing.content) {
        this.errors.content = true
      }

      if (!this.landing.title) {
        this.errors.title = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.action == 'update') {
          this.$axios.$put(`${process.env.API_URL}/api/v1/landing`, {
            'id': this.landing._id,
            'title': this.landing.title.trim(),
            'content': this.landing.content.trim()
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
        } else if (this.action == 'insert') {
          this.$axios.post(`${process.env.API_URL}/api/v1/landing`, {
            'title': this.landing.title.trim(),
            'content': this.landing.content.trim()
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
