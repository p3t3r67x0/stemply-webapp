<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    tbd.
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {},
  computed: {
    userId() {
      return this.$store.state.userId
    }
  },
  middleware: 'auth',
  methods: {}
}
</script>
