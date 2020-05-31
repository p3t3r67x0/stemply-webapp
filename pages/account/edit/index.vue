<template>
<div class="container mx-auto mt-3">
  <ul class="">
    <li v-for="challenge in challenges" class="bg-white rounded-lg p-3 mb-6">
      <span class="flex justify-betweeen">
        <h3 class="w-full md:w-8/12 text-xl font-bold">{{ challenge.title }}</h3>
        <p class="w-full text-right">
          <button type="button" @click="deleteEntry(challenge._id)" class="bg-red-500 hover:bg-red-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Delete</button>
          <nuxt-link :to="generateLink(challenge._id)" class="inline-block bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-2 py-1">Edit</nuxt-link>
        </p>
      </span>
      <p class="text-sm mb-1">{{ challenge.duration }}</p>
      <p class="text-lg">{{ challenge.content }}</p>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      challenges: null
    }
  },
  mounted() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge').then(res => {
      this.challenges = res.message
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    generateLink(id) {
      return `/account/edit/challenge/${id}`
    },
    deleteEntry(id) {
      alert('Not implemented yet')
    }
  }
}
</script>
