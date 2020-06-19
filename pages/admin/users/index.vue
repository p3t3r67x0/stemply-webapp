<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="flex justify-between mb-3">
      <h1 class="text-xl lg:text-2xl font-semibold">Users</h1>
      <div>
        <span class="mr-1">
          <button @click="exportForms" class="inline-block bg-teal-500 hover:bg-teal-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Export forms</button>
        </span>
        <span class="mr-1">
          <button @click="exportChallenges" class="inline-block bg-teal-500 hover:bg-teal-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Export challenges</button>
        </span>
        <span>
          <button @click="exportUsers" class="inline-block bg-teal-500 hover:bg-teal-600 focus:outline-none rounded text-white text-sm font-medium tracking-wide px-3 py-2">Export users</button>
        </span>
      </div>
    </div>
    <div class="bg-white rounded-lg p-3">
      <p v-if="showResponse" :class="[ responseError ? 'text-red-500' : 'text-green-500']" class="lg:text-lg mb-3">{{ response }}</p>
      <div class="flex justify-center">
        <table class="table table-fixed w-full text-md text-gray-800 rounded-lg">
          <tbody>
            <tr class="border-b bg-gray-800 text-white">
              <th class="lg:w-3/12 text-left p-3 px-5">{{ $t('name') }}</th>
              <th class="lg:w-4/12 text-left p-3 px-5">{{ $t('email') }}</th>
              <th class="lg:w-3/12 text-left p-3 px-5">{{ $t('roles') }}</th>
              <th class="lg:w-2/12"></th>
            </tr>
            <tr v-for="(user, i) in users" :key="user._id" class="border-b bg-gray-100 hover:bg-gray-400">
              <td data-label="Name" class="text-gray-700 px-3 py-1 md:p-3">
                <input v-model="users[i].name" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text">
              </td>
              <td data-label="Email" class="text-gray-700 px-3 py-1 md:p-3">
                <input v-model="users[i].email" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text">
              </td>
              <td data-label="Role" class="text-gray-700 px-3 py-1 md:p-3">
                <input v-model="users[i].roles" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded p-3 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text">
              </td>
              <td class="flex justify-end p-3">
                <button ref="update" v-on:click.stop="updateUser(i, user._id)" class="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline" type="button">Save</button>
                <button ref="delete" v-on:click.stop="deleteUser(i, user._id)" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline" type="button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      response: null,
      responseError: false,
      showResponse: false
    }
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/user/list`).then(res => {
      this.users = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        this.response = error.response.data.message
        this.responseError = true
        this.showResponse = true
      } else {
        console.log(error.message)
      }
    })
  },
  middleware: 'auth',
  methods: {
    updateUser(index, id) {
      this.$refs.update[index].blur()
      let roles = this.users[index].roles

      if (Array.isArray(this.users[index].roles)) {
        roles = this.users[index].roles.join(',')
      }

      this.$axios.$put(`${process.env.API_URL}/api/v1/user`, {
        id: id,
        roles: roles,
        name: this.users[index].name,
        email: this.users[index].email,
      }).then((res) => {
        this.response = res.message
        this.responseError = false
        this.showResponse = true
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          this.response = error.response.data.message
          this.responseError = true
          this.showResponse = true
        } else {
          console.log(error.message)
        }
      })
    },
    deleteUser(index, id) {
      this.$refs.delete[index].blur()
      this.$axios.$delete(`${process.env.API_URL}/api/v1/user/${id}`).then((res) => {
        this.response = res.message
        this.responseError = false
        this.showResponse = true
        this.users.splice(index, 1)
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          this.response = error.response.data.message
          this.responseError = true
          this.showResponse = true
        } else {
          console.log(error.message)
        }
      })
    },
    exportUsers() {
      this.$axios.$get(`${process.env.API_URL}/api/v1/user/export`, {
        responseType: 'blob'
      }).then(res => {
        const url = URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', 'users.csv')
        document.body.appendChild(link)
        link.click()
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          this.response = error.response.data.message
          this.responseError = true
          this.showResponse = true
        } else {
          console.log(error)
        }
      })
    },
    exportChallenges() {
      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/export`, {
        responseType: 'blob'
      }).then(res => {
        const url = URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', 'challenges.csv')
        document.body.appendChild(link)
        link.click()
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          this.response = error.response.data.message
          this.responseError = true
          this.showResponse = true
        } else {
          console.log(error)
        }
      })
    },
    exportForms() {
      this.$axios.$get(`${process.env.API_URL}/api/v1/challenge/task/form/export`, {
        responseType: 'blob'
      }).then(res => {
        const url = URL.createObjectURL(new Blob([res]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', 'forms.csv')
        document.body.appendChild(link)
        link.click()
      }).catch(error => {
        if (error.hasOwnProperty('response')) {
          this.response = error.response.data.message
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
