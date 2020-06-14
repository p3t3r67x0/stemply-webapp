<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="flex justify-between">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Fragenkatalog</h1>
      <span>
        <nuxt-link to="/admin/forms" class="inline-block bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">All forms</nuxt-link>
      </span>
    </div>
    <form class="bg-white rounded p-3" @submit.prevent="submitForm">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
        Fragentyp
      </label>
      <div class="relative z-0">
        <select v-model="questionType" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option value="text">Textfrage</option>
          <option value="select">Auswahlfrage</option>
          <option value="checkbox">Checkboxfrage</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <div class="mb-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          Frage
        </label>
        <input type="text" class="w-full appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" v-model="question">
      </div>
      <div v-if="questionType == 'text'" class="mb-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          Placeholder text
        </label>
        <input type="text" class="w-full appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" v-model="placeholder">
      </div>
      <div v-if="questionType == 'select'" class="mb-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          Auswahlfrage
        </label>
        <div v-for="option, index in options" :key="option.id" class="flex items-center mb-2">
          <input v-model="option.value" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-2">
          <button type="button" @click="removeInput(index)" :disabled="index === 0" :class="[index === 0 ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700']" class="focus:outline-none rounded text-white text-sm font-medium h-10 w-10 mr-2">-</button>
          <button type="button" @click="addInput(index)" class="bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium h-10 w-10">+</button>
        </div>
      </div>
      <div v-if="questionType == 'checkbox'" class="mb-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="fromDate">
          Checkboxfrage
        </label>
        <div v-for="option, index in options" :key="option.id" class="flex items-center mb-2">
          <input v-model="option.value" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-2">
          <button type="button" @click="removeInput(index)" :disabled="index === 0" :class="[index === 0 ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700']" class="focus:outline-none rounded text-white text-sm font-medium h-10 w-10 mr-2">-</button>
          <button type="button" @click="addInput(index)" class="bg-gray-600 hover:bg-gray-700 focus:outline-none rounded text-white text-sm font-medium h-10 w-10">+</button>
        </div>
      </div>
      <div class="text-right">
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Speichern</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      question: null,
      placeholder: null,
      questionType: 'checkbox',
      optionsCounter: 0,
      options: [{
        id: 'option0',
        value: null
      }]
    }
  },
  asyncData(context) {
    context.$axios.$get('https://jsonplaceholder.typicode.com/todos/1').then(res => {
      console.log(res)
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    submitForm(query) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/task/form', {
        type: this.questionType,
        question: this.question,
        form: this.options
      }).then(res => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    addInput(index) {
      this.options.splice(index + 1, 0, {
        id: `option${++this.optionsCounter}`,
        value: null
      });
    },
    removeInput(index) {
      this.options.splice(index, 1);
    }
  }
}
</script>
