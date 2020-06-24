<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="lg:flex justify-between mb-3">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Wiki entries</h1>
      <form @submit.prevent="searchWikiEntries" class="relative w-wull lg:w-1/2">
        <input v-model="query" @focusout="searchWikiEntries" type="search" name="search" placeholder="online marketing"
          class="w-full appearance-none block w-full bg-gray-200 text-gray-700 border rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white rounded pr-12">
        <button type="submit" class="absolute right-0 top-0 mt-4 mr-4 focus:outline-none">
          <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 56.966 56.966">
            <path
              d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </form>
    </div>
    <ul>
      <li v-for="entry, index in entries" class="bg-white rounded-lg p-3 mb-6">
        <h3 class="w-full lg:w-10/12 text-xl font-semibold mb-2">{{ entry.title }}</h3>
        <ul v-if="entry.tags" class="mb-3">
          <li v-for="tag in entry.tags" class="inline-flex bg-gray-300 text-blue-600 font-medium rounded-lg px-2 mr-3">
            <nuxt-link :to="generateTagNameLink(tag.toLowerCase())">{{ tag.toLowerCase() }}</nuxt-link>
          </li>
        </ul>
        <vue-markdown-plus class="markdown" :source="entry.content" />
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
      query: null,
      entries: []
    }
  },
  created() {
    if (this.tagName) {
      this.$axios.$post(`${process.env.API_URL}/api/v1/wiki/entry/tag`, {
        tag: this.tagName
      }).then(res => {
        this.entries = res.message
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    } else {
      this.$axios.$get(`${process.env.API_URL}/api/v1/wiki/entry/list`).then(res => {
        this.entries = res.message
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
    tagName() {
      return this.$route.params.id
    }
  },
  middleware: 'auth',
  methods: {
    generateTagNameLink(tagName) {
      return `/account/wiki/${tagName}`
    },
    searchWikiEntries() {
      this.$axios.$post(`${process.env.API_URL}/api/v1/wiki/entry/search`, {
        query: this.query
      }).then(res => {
        this.entries = res.message
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          console.log(error.response.data.message)
        } else {
          console.log(error)
        }
      })
    }
  }
}
</script>
