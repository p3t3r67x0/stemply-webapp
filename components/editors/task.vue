<template>
<div>
  <p v-if="showResponse" :class="[ responseError ? 'text-red-500' : 'text-green-500']" class="lg:text-lg mb-3">{{ response }}</p>
  <form ref="contactForm" @submit.prevent="submitForm" class="w-full">
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="title">
        Title
      </label>
      <input name="title" v-model="object.title" v-bind:class="{'border-red-500': errors.title}" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white" id="title"
        type="text" placeholder="Learn to use the new media">
      <p v-if="errors.title" class="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <div class="sm:flex w-full mb-6">
      <div class="sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 md:mb-0 sm:mr-4">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          From
        </label>
        <client-only>
          <date-picker v-model="object.fromDate" format="DD-MM-YYYY" valueType="DD-MM-YYYY" :disabled-date="notBeforeToday" class="w-full focus:outline-none" placeholder="DD-MM-YYYY"></date-picker>
        </client-only>
        <p v-if="errors.fromDate" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
      <div class="sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="toDate">
          To
        </label>
        <client-only>
          <date-picker v-model="object.toDate" format="DD-MM-YYYY" valueType="DD-MM-YYYY" :disabled-date="notBeforeToday" class="w-full focus:outline-none" placeholder="DD-MM-YYYY"></date-picker>
        </client-only>
        <p v-if="errors.toDate" class="text-red-500 text-xs italic">Please fill out this field.</p>
      </div>
    </div>
    <div class="w-full mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="content">
        Content
      </label>
      <textarea name="content" v-model="object.content" v-bind:class="{'border-red-500': errors.content}"
        class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="content" type="content"
        placeholder="Describe your chalenge here"></textarea>
      <p v-if="errors.content" class="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <ul v-if="forms.length > 0" class="mb-6">
      <li v-for="form in forms">
        <h2 class="text-xl font-semibold mb-3">Question</h2>
        <div class="bg-gray-200 rounded-lg p-2">
          <span class="flex justify-betweeen mb-3">
            <h3 class="w-full lg:w-10/12 text-xl font-medium">{{ form.question }}</h3>
            <p class="w-full lg:w-2/12 text-right">
              <button type="button" @click="toggleSubscribe(form._id)" :class="[matchForm(form._id) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600']"
                class="inline-block focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">{{ matchForm(form._id) ? 'Unappend' : 'Append'}}</button>
            </p>
          </span>
          <div v-if="form.type === 'text'">
            <input type="text" class="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded p-3 mb-1 leading-tight focus:outline-none">
          </div>
          <ul v-if="form.type !== 'input'">
            <li v-if="form.type == 'checkbox'" v-for="option in form.form" class="flex mb-1">
              <fa :icon="['fas', 'check-square']" class="text-gray-500 inline-block text-xl lg:text-2xl w-5 mr-2" />
              <span>{{ option.value }}</span>
            </li>
            <li v-if="form.type == 'select'" class="relative z-0">
              <select class="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded p-3 mb-1 leading-tight focus:outline-none">
                <option v-for="option in form.form">{{ option.value }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="text-right">
      <nuxt-link to="/admin" class="inline-block bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2 mr-1">
        Back
      </nuxt-link>
      <button class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2" type="submit">
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
      forms: [],
      toDate: null,
      fromDate: null,
      showResponse: false,
      responseError: false,
      response: '',
      object: {
        title: '',
        toDate: '',
        fromDate: '',
        content: '',
        fid: []
      },
      errors: {
        title: false,
        toDate: false,
        fromDate: false,
        content: false
      }
    }
  },
  created() {
    if (this.action == 'update') {
      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/${this.target}/detail/${this.objectId}`).then(res => {
        this.object['_id'] = res.message._id
        this.object['toDate'] = res.message.to
        this.object['fromDate'] = res.message.from
        this.object['content'] = res.message.content
        this.object['title'] = res.message.title
        this.object['fid'] = res.message.fid || []
      }).catch(error => {
        console.log(error.response.data)
      })
    }

    this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/task/form/list`).then(res => {
      this.forms = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error.message)
      }
    })
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
    yesterday() {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      return yesterday
    },
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
    'object.fromDate': function() {
      if (this.object.fromDate) {
        this.errors.fromDate = false
      } else {
        this.errors.fromDate = true
      }
    },
    'object.toDate': function() {
      if (this.object.toDate) {
        this.errors.toDate = false
      } else {
        this.errors.toDate = true
      }
    }
  },
  methods: {
    notBeforeToday(date) {
      return date < this.yesterday
    },
    toggleSubscribe(formId) {
      if (!this.object.fid.includes(formId)) {
        this.object.fid.push(formId)
      } else {
        const index = this.object.fid.findIndex(id => id === formId)
        this.object.fid.splice(index, 1)
      }
    },
    matchForm(formId) {
      return this.object.fid.includes(formId)
    },
    submitForm: function(e) {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.object.content) {
        this.errors.content = true
      }

      if (!this.object.title) {
        this.errors.title = true
      }

      if (!this.object.fromDate) {
        this.errors.fromDate = true
      }

      if (!this.object.toDate) {
        this.errors.toDate = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        if (this.action == 'update') {
          this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/${this.target}/detail/${this.objectId}`, {
            'title': this.object.title.trim(),
            'content': this.object.content.trim(),
            'from_date': this.object.fromDate,
            'to_date': this.object.toDate,
            'fid': this.object.fid
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
          this.$axios.post(`${process.env.API_URL}/api/v1/challenge/${this.target}`, {
            'id': this.objectId.trim(),
            'title': this.object.title.trim(),
            'content': this.object.content.trim(),
            'from_date': this.object.fromDate,
            'to_date': this.object.toDate,
            'fid': this.object.fid
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
