<template>
<div class="container bg-white rounded-lg mx-auto p-3">
  <h1 class="text-2xl lg:text-4xl font-medium mb-2">Add task</h1>
  <editor-component target="task" action="update" :taskId="taskId" :challengeId="challengeId" />
</div>
</template>

<script>
import EditorComponent from '@/components/editor.vue'

export default {
  data() {
    return {
      challengeId: ''
    }
  },
  computed: {
    taskId() {
      return this.$route.params.id || ''
    }
  },
  components: {
    EditorComponent
  },
  middleware: 'auth',
  methods: {}
}
</script>
