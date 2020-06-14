<template>
<div class="container mx-auto mt-3">
  <form-component />
</div>
</template>

<script>
import FormComponent from '@/components/form'

export default {
  data() {
    return {}
  },
  components: {
    FormComponent
  },
  middleware: 'auth',
  methods: {}
}
</script>
