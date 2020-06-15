<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <h1 class="text-xl lg:text-2xl font-semibold mb-1">Settings</h1>
    <p class="text-lg mb-6">Here you will find some settings to change the theme colors and set logo</p>
    <div class="bg-white rounded-lg p-3 mb-6">
      <h2 class="text-xl font-bold mb-3">Landingpage</h2>
      <landing-component />
    </div>
    <div class="bg-white rounded-lg p-3 mb-6">
      <h2 class="text-xl font-bold mb-3">Template Confirmation Mail</h2>
      <template-component target="confirm" :data.sync="templateConfirm" />
    </div>
    <div class="bg-white rounded-lg p-3 mb-6">
      <h2 class="text-xl font-bold mb-3">Template Reset Password</h2>
      <template-component target="reset" :data.sync="templateReset" />
    </div>
  </div>
</div>
</template>

<script>
import LandingComponent from '@/components/landing'
import TemplateComponent from '@/components/template'

export default {
  data() {
    return {
      templateReset: {},
      templateConfirm: {}
    }
  },
  components: {
    LandingComponent,
    TemplateComponent
  },
  created() {
    this.$axios.$get(`${process.env.API_URL}/api/v1/template/list`).then(res => {
      this.templateConfirm = res.message.filter(e => e.type === 'confirm')
      this.templateReset = res.message.filter(e => e.type === 'reset')
      console.log(this.templateReset)
    }).catch(error => {
      console.log(error.response.data)
    })
  },
  middleware: 'auth',
  methods: {}
}
</script>
