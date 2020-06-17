<template>
<div class="container mx-auto mt-3 lg:mt-0">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <h1 class="text-xl lg:text-2xl font-bold">{{ task.title }}</h1>
      <vue-markdown-plus class="markdown mb-6" :source="task.content" />
      <form v-if="task.forms" @submit.prevent>
        <ul>
          <li v-for="form, index in task.forms">
            <h2 class="text-xl font-semibold mb-3">Question</h2>
            <div class="bg-gray-200 rounded-lg p-2">
              <span class="flex justify-betweeen mb-3">
                <h3 class="w-full lg:w-10/12 text-xl font-medium">{{ form.question }}</h3>
              </span>
              <div v-if="form.type === 'text'">
                <input v-model="task.forms[index].text" @focusout="submitForm(form._id, task._id, task.forms[index].text)" type="text"
                  class="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded p-3 mb-1 leading-tight focus:outline-none">
              </div>
              <div v-if="form.type == 'checkbox'" v-for="option, i in form.form" class="flex mb-1">
                <fa @click="toggleCheckbox(form._id, task._id, i)" :class="[toggleCheckboxClass(form._id, task._id, i) ? 'text-green-500' : 'text-gray-500']" :icon="['fas', 'check-square']" class="inline-block text-xl lg:text-2xl w-5 mr-2" />
                <span>{{ option.value }}</span>
              </div>
              <div v-if="form.type == 'select'" class="relative z-0">
                <select v-model="task.forms[index].select" @change="submitForm(form._id, task._id, task.forms[index].select)"
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
    </div>
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      task: {},
      checked: []
    }
  },
  created() {
    if (this.taskId) {
      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/task/detail/${this.taskId}`).then(res => {
        this.task = res.message
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    }
  },
  components: {
    VueMarkdownPlus
  },
  computed: {
    taskId() {
      return this.$route.params.id
    }
  },
  middleware: 'auth',
  methods: {
    toggleCheckboxClass(formId, taskId, index) {
      let elementMatch = false
      const elementId = `checkbox-${index}`
      const object = {
        formId: formId,
        taskId: taskId,
        elementId: elementId
      }

      this.checked.forEach(item => {
        if (item.formId === object.formId && item.taskId === object.taskId && item.elementId === object.elementId) {
          elementMatch = true
        }
      })

      return elementMatch
    },
    toggleCheckbox(formId, taskId, index) {
      let elementMatch = false
      const elementId = `checkbox-${index}`
      const object = {
        formId: formId,
        taskId: taskId,
        elementId: elementId
      }

      this.checked.forEach(item => {
        if (item.formId === object.formId && item.taskId === object.taskId && item.elementId === object.elementId) {
          elementMatch = true
        }
      })

      if (elementMatch) {
        const elementMatchId = this.checked.findIndex(e => e.elementId === elementMatch.elementId)
        this.checked.splice(elementMatchId, 1)
      } else {
        this.checked.push(object)
      }

      this.submitForm(formId, taskId, this.checked.map(e => e['elementId']))
    },
    submitForm(formId, taskId, value) {
      this.$axios.$post(`${process.env.API_URL}/api/v1/challenge/task/response`, {
        fid: formId,
        tid: taskId,
        reply: value
      }).then(res => {
        console.log(res)
        this.response = res.message
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
</script>
