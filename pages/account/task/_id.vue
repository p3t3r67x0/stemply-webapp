<template>
<div class="container mx-auto mt-3 lg:mt-0">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <loading-component v-if="loadingIndicator" />

      <div class="flex justify-between">
        <h1 class="text-xl lg:text-2xl font-bold mr-3">{{ task.title }}</h1>
        <span>
          <nuxt-link :to="'/account'" class="inline-block bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Back</nuxt-link>
        </span>
      </div>
      <vue-markdown-plus class="markdown" :source="task.content" />
      <form v-if="task.forms" @submit.prevent class="mt-6">
        <h2 class="text-2xl font-medium mb-3">Kontrollfragen</h2>
        <ul>
          <li v-for="form, index in task.forms">
            <div class="bg-gray-200 rounded-lg p-2 mb-3">
              <h3 class="text-lg font-medium mb-3">{{ form.question }}</h3>
              <div v-if="form.type === 'text'">
                <input v-model="task.forms[index].reply" @focusout="updateResponse(form._id, task._id, task.forms[index].reply)" type="text"
                  class="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded p-3 mb-1 leading-tight focus:outline-none">
              </div>
              <div v-if="form.type == 'checkbox'" v-for="option, i in form.form" class="flex mb-1">
                <fa :key="update" @click="toggleCheckbox(form._id, task._id, index, i)" :class="[setCheckboxClass(index, i) ? 'text-green-500' : 'text-gray-500']" :icon="['fas', 'check-square']"
                  class="cursor-pointer inline-block text-xl lg:text-2xl w-5 mr-2" />
                <span>{{ option.value }}</span>
              </div>
              <div v-if="form.type == 'select'" class="relative z-0">
                <select v-model="task.forms[index].reply" @change="updateResponse(form._id, task._id, task.forms[index].reply)"
                  class="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded p-3 mb-1 leading-tight focus:outline-none">
                  <option v-for="option in form.form">{{ option.value }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </form>
      <div class="text-right">
        <nuxt-link :to="'/account'" class="focus:outline-none rounded text-blue-600 hover:text-blue-800">Back to challenges</nuxt-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'
import LoadingComponent from '@/components/loading'

export default {
  data() {
    return {
      task: {},
      update: false
    }
  },
  components: {
    LoadingComponent,
    VueMarkdownPlus
  },
  created() {
    if (this.taskId) {
      this.$store.commit('updateLoadingIndicator', true)

      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/task/detail/${this.taskId}`).then(res => {
        this.task = res.message
        this.$store.commit('updateLoadingIndicator', false)
      }).catch(error => {
        this.$store.commit('updateLoadingIndicator', false)

        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    }
  },
  computed: {
    taskId() {
      return this.$route.params.id
    },
    loadingIndicator() {
      return this.$store.state.loading
    }
  },
  middleware: 'auth',
  methods: {
    setCheckboxClass(formIndex, checkboxIndex) {
      const elementId = `option${checkboxIndex}`
      let elementMatch = false

      if (!Array.isArray(this.task.forms[formIndex].reply)) {
        this.task.forms[formIndex].reply = []
      }

      if (this.task.forms[formIndex].reply.includes(elementId)) {
        elementMatch = true
      }

      return elementMatch
    },
    toggleCheckbox(formId, taskId, formIndex, checkboxIndex) {
      const elementId = `option${checkboxIndex}`
      let elementMatch = false

      if (this.task.forms[formIndex].reply.includes(elementId)) {
        elementMatch = true
      }

      if (elementMatch) {
        const elementIndex = this.task.forms[formIndex].reply.findIndex(e => e === elementId)
        this.task.forms[formIndex].reply.splice(elementIndex, 1)
        this.removeResponse(formId, taskId, elementId)
      } else {
        this.task.forms[formIndex].reply.push(elementId)
        this.updateResponse(formId, taskId, this.task.forms[formIndex].reply)
      }

      this.update = !this.update
    },
    updateResponse(formId, taskId, value) {
      if (Array.isArray(value)) {
        value = value.filter(e => e)
      }

      this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/task/response`, {
        fid: formId,
        tid: taskId,
        reply: value
      }).then(res => {
        console.log(res)
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data)
        } else {
          console.log(error.message)
        }
      })
    },
    removeResponse(formId, taskId, value) {
      if (Array.isArray(value)) {
        value = value.filter(e => e)
      }

      this.$axios.$put(`${process.env.API_URL}/api/v1/challenge/task/response`, {
        fid: formId,
        tid: taskId,
        reply: value
      }).then(res => {
        console.log(res)
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
</script>
