<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <request-component />
  </div>
</div>
</template>

<script>
import RequestComponent from '@/components/request'

export default {
  data() {
    return {}
  },
  components: {
    RequestComponent
  },
  middleware: 'auth',
  methods: {}
}

</script>
