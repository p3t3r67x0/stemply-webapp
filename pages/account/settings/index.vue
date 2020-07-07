<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-bold mb-3">Einstellungen</h1>
    <div class="bg-white rounded mb-8">
      <div class="block md:flex md:justify-center">
        <div class="w-full bg-gray-200 lg:w-3/12">
          <avatar-component />
          <ul class="lg:mb-12">
            <li :class="{ 'bg-blue-500' : tabs.showProfileTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="tabs.showProfileTab ? 'text-white' : 'text-gray-700'" @click="handleTabs('showProfileTab')" class="block p-4 hover:text-white">Mein Profile</a>
            </li>
            <!--
            <li :class="{ 'bg-blue-500' : tabs.showNotificationsTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showNotificationsTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showNotificationsTab')" class="block p-4 hover:text-white">Notifications</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showBillingTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showBillingTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showBillingTab')" class="block p-4 hover:text-white">Billing Details</a>
            </li>-->
            <li :class="{ 'bg-blue-500' : tabs.showLastseenTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showLastseenTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showLastseenTab')" class="block p-4 hover:text-white">Letzte Logins</a>
            </li>
            <li :class="{ 'bg-blue-500' : tabs.showPasswordTab }" class="cursor-pointer border-b border-white hover:bg-blue-500">
              <a :class="[ tabs.showPasswordTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showPasswordTab')" href="#" class="block p-4 hover:text-white">Passwort ändern</a>
            </li>
            <li :class="{ 'bg-red-500' : tabs.showAccountTab }" class="cursor-pointer border-b border-white hover:bg-red-500">
              <a :class="[ tabs.showAccountTab ? 'text-white' : 'text-gray-700' ]" @click="handleTabs('showAccountTab')" href="#" class="block p-4 hover:text-white">Konto löschen</a>
            </li>
          </ul>
        </div>
        <div class="w-full lg:w-9/12 p-4">
          <profile-component v-if="tabs.showProfileTab" />
          <!--<billing-component v-if="tabs.showBillingTab" />
          <notifications-component v-if="tabs.showNotificationsTab" />-->
          <account-component v-if="tabs.showAccountTab" />
          <lastseen-component v-if="tabs.showLastseenTab" />
          <password-component v-if="tabs.showPasswordTab" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import AvatarComponent from '@/components/settings/avatar'
import ProfileComponent from '@/components/settings/profile'
import AccountComponent from '@/components/settings/account'
import LastseenComponent from '@/components/settings/lastseen'
import PasswordComponent from '@/components/settings/password'
/*
import BillingComponent from '@/components/settings/billing'
import NotificationsComponent from '@/components/settings/notifications'
*/

export default {
  data() {
    return {
      tabs: {
        showProfileTab: true,
        showBillingTab: false,
        showLastseenTab: false,
        showPasswordTab: false,
        showNotificationsTab: false
      }
    }
  },
  components: {
    AvatarComponent,
    ProfileComponent,
    AccountComponent,
    LastseenComponent,
    PasswordComponent,
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
