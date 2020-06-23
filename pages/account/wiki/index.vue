<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-medium mb-3">Wiki entries</h1>
    <ul>
      <li v-for="entry, index in entries" class="bg-white rounded-lg p-3 mb-6">
        <h3 class="w-full lg:w-10/12 text-xl font-semibold mb-2">{{ entry.title }}</h3>
        <ul v-if="entry.tags" class="mb-3">
          <li v-for="tag in entry.tags" class="inline-flex bg-gray-300 text-blue-600 font-medium rounded-lg px-2 mr-3">
            {{ tag.toLowerCase() }}
          </li>
        </ul>
        {{ entry.content }}
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      entries: []
    }
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/wiki/entry/list`).then(res => {
      this.entries = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error.message)
      }
    })
  },
  middleware: 'auth',
  methods: {}
}
</script>
