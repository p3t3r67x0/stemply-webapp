<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-bold mb-3">Settings</h1>
    <div class="bg-white rounded mb-8">
      <div class="block md:flex md:justify-center">
        <div class="w-full bg-gray-200 lg:w-3/12">
          <avatar-component />
          <ul class="lg:mb-12">
            <li :class="{ 'bg-blue-500' : tabs.showProfileTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="tabs.showProfileTab ? 'text-white' : 'text-gray-700'" @click="handleTabs('showProfileTab')" class="block p-4 hover:text-white">Profile</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showNotificationsTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showNotificationsTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showNotificationsTab')" class="block p-4 hover:text-white">Notifications</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showBillingTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showBillingTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showBillingTab')" class="block p-4 hover:text-white">Billing Details</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showLastseenTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showLastseenTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showLastseenTab')" class="block p-4 hover:text-white">Last Logins</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showPasswordTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showPasswordTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showPasswordTab')" href="#" class="block p-4 hover:text-white">Reset Password</a>
            </li>
            <li :class="{ 'bg-red-500' : tabs.showAccountTab }" class="cursor-pointer border-b border-white hover:bg-red-500">
              <a :class="[ tabs.showAccountTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showAccountTab')" href="#" class="block p-4 hover:text-white">Delete Account</a>
            </li>
          </ul>
        </div>
        <div class="w-full lg:w-9/12 p-4">
          <profile-component v-if="tabs.showProfileTab" />
          <billing-component v-if="tabs.showBillingTab" />
          <account-component v-if="tabs.showAccountTab" />
          <lastseen-component v-if="tabs.showLastseenTab" />
          <notifications-component v-if="tabs.showNotificationsTab" />
          <password-component v-if="tabs.showPasswordTab" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import AvatarComponent from '@/components/settings/avatar.vue'
import ProfileComponent from '@/components/settings/profile.vue'
import BillingComponent from '@/components/settings/billing.vue'
import AccountComponent from '@/components/settings/account.vue'
import LastseenComponent from '@/components/settings/lastseen.vue'
import NotificationsComponent from '@/components/settings/notifications.vue'
import PasswordComponent from '@/components/settings/password.vue'

export default {
  data() {
    return {
      tabs: {
        showProfileTab: true,
        showBillingTab: false,
        showLastseenTab: false,
        showNotificationsTab: false,
        showPasswordTab: false,
      }
    }
  },
  components: {
    AvatarComponent,
    ProfileComponent,
    BillingComponent,
    AccountComponent,
    LastseenComponent,
    NotificationsComponent,
    PasswordComponent
  },
  middleware: 'auth',
  methods: {
    handleTabs(tabKey) {
      const tabs = Object.values(this.tabs)
      const tabKeys = Object.keys(this.tabs)
      const indexActiveTab = tabs.findIndex(e => e === true)

      this.tabs[tabKeys[indexActiveTab]] = false
      this.tabs[tabKey] = true
    }
  }
}
</script>
