<template>
<div>
  <p v-if="showResponse" class="text-green-500 lg:text-lg mb-3">{{ response }}</p>
  <form ref="contactForm" @submit.prevent="submitForm" class="w-full">
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
        Title
      </label>
      <input name="title" v-model="object.title" v-bind:class="{'border-red-500': errors.title}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="title"
        type="text" placeholder="Learn to use the new media">
      <p v-if="errors.title" class="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
        Duration
      </label>
      <input name="duration" v-model="object.duration" v-bind:class="{'border-red-500': errors.duration}"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="duration" type="duration" placeholder="Valid for three weeks">
      <p v-if="errors.duration" class="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="duration">
        Content
      </label>
      <textarea name="duration" v-model="object.content" v-bind:class="{'border-red-500': errors.content}"
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
</template>

<script>
export default {
  data() {
    return {
      response: '',
      showResponse: false,
      object: {
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
  created() {
    if (this.action == 'update') {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/' + this.target + '/detail', {
        'id': this.objectId.trim()
      }).then(res => {
        this.object = res.message
      }).catch(error => {
        console.log(error.response.data)
      })
    }
  },
  props: {
    action: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      required: false
    },
    challengeId: {
      type: String,
      required: false
    }
  },
  computed: {
    objectId() {
      if (this.challengeId) {
        return this.challengeId
      }

      if (this.taskId) {
        return this.taskId
      }
    }
  },
  watch: {
    'object.content': function() {
      if (this.object.content.trim() !== '') {
        if (this.object.content.trim().length > 7) {
          this.errors.content = false
        } else {
          this.errors.content = true
        }
      }
    },
    'object.title': function() {
      if (this.object.title.trim() !== '') {
        if (this.object.title.trim().length > 7) {
          this.errors.title = false
        } else {
          this.errors.title = true
        }
      }
    },
    'object.duration': function() {
      if (this.object.duration > 0) {
        this.errors.duration = false
      } else {
        this.errors.duration = true
      }
    }
  },
  methods: {
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.object.content) {
        this.errors.content = true
      }

      if (!this.object.title) {
        this.errors.title = true
      }

      if (!this.object.duration) {
        this.errors.duration = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.action == 'update') {
          this.$axios.$put(process.env.API_URL + '/api/v1/challenge/' + this.target + '/detail', {
            'id': this.objectId.trim(),
            'title': this.object.title.trim(),
            'content': this.object.content.trim(),
            'duration': this.object.duration
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
          this.$axios.post(process.env.API_URL + '/api/v1/challenge/' + this.target, {
            'id': this.objectId.trim(),
            'title': this.object.title.trim(),
            'duration': this.object.duration.trim(),
            'content': this.object.content.trim()
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
