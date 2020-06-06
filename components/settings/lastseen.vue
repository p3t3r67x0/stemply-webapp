<template>
<div>
  <h2 class="text-2xl mb-4">Last Logins</h2>
  <table class="w-full text-md text-white bg-blue-900 rounded">
    <tr class="border-b">
      <th class="text-left p-3">Login</th>
      <th class="text-left p-3">IP</th>
      <th class="text-left p-3">Browser</th>
    </tr>
    <tr v-for="(login, i) in logins" :key="login.id" class="border-b hover:bg-blue-200">
      <td data-label="Login" class="p-3 text-gray-700">{{ login.last_seen }}</td>
      <td data-label="IP" class="p-3 text-gray-700">{{ login.ip_address }}</td>
      <td data-label="Browser" class="p-3 text-gray-700">{{ login.browser }}</td>
    </tr>
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
    loadinIndicator() {
      return this.$store.state.loading
    },
  },
  components: {},
  created() {},
  methods: {}
}
</script>
