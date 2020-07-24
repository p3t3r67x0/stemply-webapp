<template>
<div>
  <h2 class="text-2xl mb-4">{{ $t('profile.profile') }}</h2>
  <form v-on:submit.prevent="updateUserSettings">
    <p v-if="showResponse" :class="[ responseError ? 'text-red-500' : 'text-green-500']" class="lg:text-lg mb-3">{{ response }}</p>
    <div class="block md:flex">
      <div class="mb-3 md:w-3/6 md:mr-2">
        <label for="name" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.displayname') }}</label>
        <input v-model="settings.name" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name"
          placeholder="Jane Doe" title="Enter your real name">
        <p v-if="errors.name" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
      </div>
      <div class="mb-3 md:w-3/6 md:ml-2">
        <label for="username" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.username') }}</label>
        <input v-model="settings.username" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="username"
          placeholder="jane.doe89" title="Enter your last name if any">
      </div>
    </div>
    <div class="mb-3">
      <label for="email" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('email') }}</label>
      <input v-model="settings.email" type="email" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email"
        placeholder="me@example.com" title="Enter your email">
      <p v-if="errors.email" class="text-red-500 text-xs italic">{{ $t('fillfield') }}</p>
    </div>
    <div class="mb-3">
      <label for="location" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.location') }}</label>
      <input v-model="settings.location" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="location"
        placeholder="New York, USA" title="Enter a location">
    </div>
    <div class="mb-3">
      <label for="website" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.website') }}</label>
      <input v-model="settings.website" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="website"
        placeholder="example.com" title="Enter your website if any">
    </div>
    <div class="mb-3">
      <label for="phone" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.phone') }}</label>
      <input v-model="settings.phone" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="phone"
        placeholder="+49 7067 2147" title="Enter your phone number if any">
    </div>
    <div class="mb-3">
      <label for="bio" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{{ $t('profile.bio') }}</label>
      <textarea v-model="settings.bio" class="h-64 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="bio"
        title="Enter your bio"></textarea>
    </div>
    <div class="text-right">
      <button type="submit" class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">{{ $t('profile.save') }}</button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      response: null,
      responseError: false,
      showResponse: false,
      settings: {
        name: '',
        email: '',
        username: '',
        location: '',
        website: '',
        phone: '',
        bio: ''
      },
      errors: {
        email: false,
        name: false
      }
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/user`).then(res => {
      this.loadUserSettings(res.message)
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    serializeString(value) {
      if (typeof value === 'string') {
        value = value.trim().length > 0 ? value.trim() : ''
      } else if (typeof value === 'object') {
        value = ''
      }

      return value
    },
    loadUserSettings(data) {
      if (data) {
        this.settings.id = data.id
        this.settings.name = data.name
        this.settings.email = data.email
        this.settings.username = data.username
        this.settings.location = data.location
        this.settings.website = data.website
        this.settings.phone = data.phone
        this.settings.bio = data.bio
      }
    },
    updateUserSettings() {
      this.$axios.$put(`${process.env.API_URL}/api/v1/user/profile/${this.userId}`, {
        name: this.serializeString(this.settings.name),
        username: this.serializeString(this.settings.username),
        location: this.serializeString(this.settings.location),
        website: this.serializeString(this.settings.website),
        phone: this.serializeString(this.settings.phone),
        email: this.serializeString(this.settings.email),
        bio: this.serializeString(this.settings.bio)
      }).then(res => {
        console.log(res)
        this.response = res.message
        this.responseError = false
        this.showResponse = true
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          const response = error.response.data.message
          const values = Object.values(response)

          if (Array.isArray(values)) {
            this.response = values.join(', ')
          } else {
            this.response = response
          }

          this.responseError = true
          this.showResponse = true
        } else {
          console.log(error)
        }
      })
    }
  }
}
</script>
