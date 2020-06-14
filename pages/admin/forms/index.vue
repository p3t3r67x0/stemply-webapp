<template>
<div class="container mx-auto mt-3">
  <div class="mx-3 lg:mx-0">
    <div class="flex justify-between">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Forms</h1>
      <span>
        <nuxt-link to="/admin/form" class="inline-block bg-green-500 hover:bg-green-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">New form</nuxt-link>
      </span>
    </div>
    <ul>
      <li v-for="(form, indexForm) in forms" class="bg-white rounded-lg p-3 mb-6">
        <h2 class="text-xl font-semibold mb-3">Question</h2>
        <div class="bg-gray-200 rounded-lg p-2">
          <span class="flex justify-betweeen mb-3">
            <h3 class="w-full lg:w-10/12 text-xl font-medium">{{ form.question }}</h3>
            <p class="w-full lg:w-2/12 text-right">
              <button ref="deleteForm" type="button" @click="deleteForm(form._id, indexForm)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
              <nuxt-link :to="generateChallangeLink(form._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
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
                <option v-for="option in form.form" >{{ option.value }}</option>
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
  </div>
</div>
</template>

<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      forms: []
    }
  },
  created() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge/task/form/list').then(res => {
      console.log(res)
      this.forms = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error.message)
      }
    })
  },
  middleware: 'auth',
  methods: {
    generateChallangeLink(id) {
      return `/admin/form/${id}`
    },
    generateTaskAddLink(id) {
      return `/admin/task/add/${id}`
    },
    generateTaskEditLink(id) {
      return `/admin/task/edit/${id}`
    },
    deleteForm(id, indexForm) {
      this.$refs.deleteForm[indexForm].blur()

      this.$axios.$delete(process.env.API_URL + '/api/v1/form/' + id).then((res) => {
        this.forms.splice(indexForm, 1)

        console.log(res.message)
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error.message)
        }
      })
    }
  }
}
</script>
