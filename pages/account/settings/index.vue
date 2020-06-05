<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-bold mb-3">Settings</h1>
    <div class="bg-white rounded mb-8">
      <div class="block md:flex md:justify-center">
        <div class="w-full bg-gray-200 lg:w-3/12">
          <avatar-component />
          <ul class="lg:mb-12">
            <li :class="showProfileTab ? 'bg-blue-500' : ''" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="showProfileTab ? 'text-white' : 'text-gray-700'" v-on:click="isProfileVisible" class="block p-4 hover:text-white">Profile</a>
            </li>
            <li class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a href="#" class="block p-4 text-gray-700 hover:text-white">Email Notifications</a>
            </li>
            <li class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a href="#" class="block p-4 text-gray-700 hover:text-white">Billing Details</a>
            </li>
            <li :class="showLastseenTab ? 'bg-blue-500' : ''" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="showLastseenTab ? 'text-white' : 'text-gray-700'" v-on:click="isLastseenVisible" class="block p-4 hover:text-white">Last Logins</a>
            </li>
            <li class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a href="#" class="block p-4 text-gray-700 hover:text-white">Password</a>
            </li>
            <li class="cursor-pointer border-b border-white hover:bg-red-500">
              <a href="#" class="block p-4 text-gray-700 hover:text-white">Delete Account</a>
            </li>
          </ul>
        </div>
        <div class="w-full lg:w-9/12 p-4">
          tbd.
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import AvatarComponent from '@/components/avatar.vue'

export default {
  data() {
    return {
      showProfileTab: true,
      showLastseenTab: false
    }
  },
  components: {
    AvatarComponent
  },
  middleware: 'auth',
  methods: {
    isProfileVisible() {
      this.showProfileTab = true
      this.showLastseenTab = false
    },
    isLastseenVisible() {
      this.showLastseenTab = true
      this.showProfileTab = false
    }
  }
}
</script>
