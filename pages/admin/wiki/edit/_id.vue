<template>
<div class="container mx-auto">
  <div class="mx-3 lg:mx-0">
    <div class="bg-white rounded-lg p-3">
      <h1 class="text-xl lg:text-2xl font-medium mb-3">Edit Wiki Entry</h1>
      <wiki-editor-component action="update" :entryId="entryId" />
    </div>
  </div>
</div>
</template>

<script>
import WikiEditorComponent from '@/components/editors/wiki'

export default {
  data() {
    return {}
  },
  computed: {
    entryId() {
      return this.$route.params.id || ''
    }
  },
  components: {
    WikiEditorComponent
  },
  middleware: 'auth',
  methods: {}
}
</script>
