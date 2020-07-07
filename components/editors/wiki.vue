<template>
<div>
  <p v-if="showResponse" :class="[ responseError ? 'text-red-500' : 'text-green-500']" class="lg:text-lg mb-3">{{ response }}</p>
  <form @submit.prevent="submitForm" class="w-full">
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
        Title
      </label>
      <input name="title" v-model="object.title" v-bind:class="{'border-red-500': errors.title}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="title"
        type="text" placeholder="Search Engine Optimization">
      <p v-if="errors.title" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
        Tags
      </label>
      <input name="title" v-model="object.tags" v-bind:class="{'border-red-500': errors.tags}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="tags"
        type="text" placeholder="marketing, search, offline">
      <p v-if="errors.tags" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="content">
        Content
      </label>
      <textarea name="content" v-model="object.content" v-bind:class="{'border-red-500': errors.content}"
        class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="content" type="content"
        placeholder="Describe your chalenge here"></textarea>
      <p v-if="errors.content" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
    </div>
    <div class="text-right">
      <nuxt-link :to="localePath('/admin/wiki')" class="inline-block bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2 mr-1">
        Back
      </nuxt-link>
      <button type="submit" class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">
        Save
      </button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      response: null,
      showResponse: false,
      responseError: false,
      object: {
        tags: '',
        title: '',
        content: ''
      },
      errors: {
        tags: false,
        title: false,
        content: false
      }
    }
  },
  created() {
    if (this.action == 'update') {
      this.$axios.$get(`${process.env.API_URL}/api/v1/wiki/entry/${this.objectId}`).then(res => {
        this.object['_id'] = res.message._id
        this.object['tags'] = this.handleArray(res.message.tags)
        this.object['content'] = res.message.content
        this.object['title'] = res.message.title
      }).catch(error => {
        console.log(error)
      })
    }
  },
  props: {
    action: {
      type: String,
      required: true
    },
    entryId: {
      type: String,
      required: false
    }
  },
  computed: {
    objectId() {
      return this.entryId
    },
    tagsArray() {
      const array = this.object.tags.split(',')

      if (Array.isArray(array)) {
        return array.map(e => e.trim())
      } else {
        return []
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
    'object.tags': function() {
      if (this.object.tags) {
        this.errors.tags = false
      } else {
        this.errors.tags = true
      }
    }
  },
  methods: {
    handleArray(array) {
      if (Array.isArray(array)) {
        return array.join(', ')
      }
    },
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.object.content) {
        this.errors.content = true
      }

      if (!this.object.title) {
        this.errors.title = true
      }

      if (!this.object.tags) {
        this.errors.tags = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.action == 'update') {
          this.$axios.$put(`${process.env.API_URL}/api/v1/wiki/entry/${this.objectId}`, {
            'title': this.object.title.trim(),
            'content': this.object.content.trim(),
            'tags': this.tagsArray
          }).then(res => {
            this.response = res.message
            this.responseError = false
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              this.response = error.response.data.message
              this.responseError = true
              this.showResponse = true
            } else {
              console.log(error.message)
            }
          })
        } else if (this.action == 'insert') {
          this.$axios.post(`${process.env.API_URL}/api/v1/wiki/entry`, {
            'title': this.object.title.trim(),
            'content': this.object.content.trim(),
            'tags': this.tagsArray
          }).then(res => {
            this.response = res.data.message
            this.responseError = false
            this.showResponse = true
          }).catch(error => {
            if (error.hasOwnProperty('response')) {
              this.response = error.response.data.message
              this.responseError = true
              this.showResponse = true
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
