<template>
<div class="container mx-auto">
  <form-component :formId="formId" />
</div>
</template>

<script>
import FormComponent from '@/components/editors/form'

export default {
  data() {
    return {}
  },
  components: {
    FormComponent
  },
  computed: {
    formId() {
      return this.$route.params.id
    }
  },
  middleware: 'auth',
  methods: {}
}
</script>
