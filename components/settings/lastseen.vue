<template>
<div>
  <h2 class="text-2xl mb-4">Last Logins</h2>
  <table class="w-full text-md text-gray-800">
    <thead>
      <tr class="border-b">
        <th class="text-left p-3">Login</th>
        <th class="text-left p-3">Address</th>
        <th class="text-left p-3">Browser</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(login, i) in logins" :key="login._id" class="border-b hover:bg-gray-200">
        <td data-label="Login" class="p-3 text-gray-700">{{ login.datetime }}</td>
        <td data-label="Address" class="p-3 text-gray-700">{{ login.address }}</td>
        <td data-label="Browser" class="p-3 text-gray-700">{{ login.browser }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default {
  data() {
    return {
      logins: null
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    },
  },
  components: {},
  created() {
    this.$axios.$get(process.env.API_URL + '/api/v1/user/lastseen/' + this.userId).then(res => {
      console.log(res)
      this.logins = res.message
    })
  },
  methods: {}
}
</script>
