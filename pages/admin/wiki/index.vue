<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="flex justify-between">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Wiki entries</h1>
      <span>
        <nuxt-link :to="localePath('/admin/wiki/add')" class="inline-block bg-green-500 hover:bg-green-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">New entry</nuxt-link>
      </span>
    </div>
    <ul>
      <li v-for="entry, index in entries" class="bg-white rounded-lg p-3 mb-6">
        <div class="flex justify-betweeen mb-2">
          <h3 class="w-full lg:w-10/12 text-xl font-semibold">{{ entry.title }}</h3>
          <p class="w-full lg:w-2/12 text-right">
            <button ref="deleteEntry" type="button" @click="deleteEntry(entry._id, index)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
            <nuxt-link :to="generateEntryEditLink(entry._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
          </p>
        </div>
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
  methods: {
    generateEntryEditLink(id) {
      return `/admin/wiki/edit/${id}`
    },
    deleteEntry(id, index) {
      this.$refs.deleteEntry[index].blur()

      this.$axios.$delete(`${process.env.API_URL}/api/v1/wiki/entry/${id}`).then(res => {
        this.entries.splice(index, 1)

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
