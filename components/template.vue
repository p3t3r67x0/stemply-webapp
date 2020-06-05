<template>
<form ref="contactForm" @submit.prevent="submitForm" class="w-full">
  <p v-if="showResponse" class="text-green-500 lg:text-lg mb-3">{{ response }}</p>
  <div class="w-full mb-6">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="subject">
      Subject
    </label>
    <input name="subject" v-model="template.subject" v-bind:class="{'border-red-500': errors.subject}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="subject"
      type="text" placeholder="Learn to use the new media">
    <p v-if="errors.subject" class="text-red-500 text-xs italic">Please fill out this field.</p>
  </div>
  <div class="w-full mb-6">
    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
      Message
    </label>
    <textarea name="duration" v-model="template.message" v-bind:class="{'border-red-500': errors.message}"
      class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="message" type="message"
      placeholder="Describe your chalenge here"></textarea>
    <p v-if="errors.message" class="text-red-500 text-xs italic">Please fill out this field.</p>
  </div>
  <p class="text-right">
    <button class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2" type="submit">
      {{ action == 'update' ? 'Update' : 'Save'}}
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
      errors: {
        subject: false,
        message: false
      },
      action: null
    }
  },
  props: {
    target: {
      type: String,
      required: true
    },
    data: {
      required: true
    }
  },
  computed: {
    template: {
      get() {
        if (Array.isArray(this.data) && this.data.length > 0) {
          this.action = 'update'

          return this.data[0]
        } else {
          return this.data
        }
      },
      set(value) {
        return value
      }
    }
  },
  watch: {
    'template.message': function() {
      if (this.template.message.trim() !== '') {
        if (this.template.message.trim().length > 7) {
          this.errors.message = false
        } else {
          this.errors.message = true
        }
      }
    },
    'template.subject': function() {
      if (this.template.subject.trim() !== '') {
        if (this.template.subject.trim().length > 7) {
          this.errors.subject = false
        } else {
          this.errors.subject = true
        }
      }
    }
  },
  middleware: 'auth',
  methods: {
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.template.subject) {
        this.errors.subject = true
      }

      if (!this.template.message) {
        this.errors.message = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        console.log(this.action)
        if (this.action == 'update') {
          this.$axios.$put(process.env.API_URL + '/api/v1/template', {
            'id': this.template._id,
            'subject': this.template.subject.trim(),
            'message': this.template.message.trim()
          }).then(res => {
            this.response = res.message
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              console.error(error.response.data)
            } else {
              console.error(error.message)
            }
          })
        } else {
          this.$axios.$post(process.env.API_URL + '/api/v1/template', {
            'type': this.target,
            'subject': this.template.subject.trim(),
            'message': this.template.message.trim()
          }).then(res => {
            this.action = 'update'
            this.template['_id'] = res._id
            this.response = res.message
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              console.error(error.response.data)
            } else {
              console.error(error)
            }
          })
        }
      }
    }
  }
}
</script>
