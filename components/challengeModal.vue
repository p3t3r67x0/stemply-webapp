<template>
<div class="fixed top-4 right-4 left-4">
  <div v-bind:class="statusClass" class="w-full max-w-xl mx-auto rounded shadow-md bg-white pl-4 pr-2 pt-2 pb-3">
    <fa v-on:click="closeModal" v-bind:icon="['fas', 'times-circle']" class="p-1 text-2xl float-right text-white cursor-pointer"></fa>
    <h2 class="text-xl">{{ text }}</h2>
    <p>{{ text }}</p>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      text: "Hello",
      statusClass: ""
    }
  },
  props: ['info', 'status'],
  computed: {},
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    })
  },
  methods: {
    closeModal() {
      this.$emit('clicked', false)
    }
  }
}
</script>
