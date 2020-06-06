<template>
<div>
  <h2 class="text-2xl mb-1">Change assword</h2>
  <form @submit.prevent="changePasswordSubmit" class="mb-8">
    <p v-if="showResponse" :class="[]" class="text-red-500 lg:text-lg mb-3">{{ response }}</p>
    <div class="lg:flex">
      <div class="lg:w-3/5 mb-1 lg:mb-6">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="password">
          New password
        </label>
        <input name="password" v-model="password" :class="{'border-red-500': errors.password}"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type="password" placeholder="password">
        <p v-if="errors.password" class="text-red-500 text-xs italic">Please enter a valid password.</p>
      </div>
      <div class="flex lg:block lg:w-2/5 text-gray-700 italic lg:not-italic lg:p-6 mb-6 lg:mb-0">
        <p><span class="lg:font-semibold text-xs lg:text-base">Password must contain</span> <span class="text-xs lg:text-base block">at least 8 characters</span></p>
      </div>
    </div>
    <div class="lg:w-3/5 mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="confirmPassword">
        Confirm password
      </label>
      <input name="confirmPassword" v-model="confirmPassword" :class="{'border-red-500': errors.confirmPassword}"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="confirmPassword" type="password" placeholder="password">
      <p v-if="errors.confirmPassword" class="text-red-500 text-xs italic">Passwords does not match.</p>
    </div>
    <p class="lg:w-3/5 text-right">
      <button class="cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide p-2" type="submit">Save password</button>
    </p>
  </form>
  <h2 class="text-2xl mb-1">Last password changes</h2>
  <div>
    tbd.
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      errors: {
        password: false,
        confirmPassword: false
      },
      password: null,
      responseError: false,
      confirmPassword: null,
      showResponse: false,
      response: null
    }
  },
  watch: {
    password: function() {
      if (this.password.trim() !== '') {
        if (this.password.trim().length > 7) {
          this.errors.password = false
        } else {
          this.errors.password = true
        }
      }
    },
    confirmPassword: function() {
      if (this.confirmPassword.trim() !== '') {
        if (this.confirmPassword.trim() === this.password.trim()) {
          this.errors.confirmPassword = false
        } else {
          this.errors.confirmPassword = true
        }
      }
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  methods: {
    changePasswordSubmit() {
      const isValidForm = (currentValue) => currentValue !== true

      if (!this.password) {
        this.errors.password = true
      }

      if (!this.confirmPassword) {
        this.errors.confirmPassword = true
      }

      if (Object.values(this.errors).every(isValidForm) === true) {
        this.$axios.$put(process.env.API_URL + '/api/v1/user/change/' + this.userId, {
          'confirm': this.confirmPassword.trim(),
          'password': this.password.trim()
        }).then(res => {
          console.log(res)
          this.response = res.message
          this.showResponse = true
        }).catch(error => {
          this.showResponse = true

          if (error.hasOwnProperty('response')) {
            this.response = error.response.data.message
          } else {
            this.response = error.message
          }
        })
      }
    }
  }
}
</script>
