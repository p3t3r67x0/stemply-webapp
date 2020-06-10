<template>
<div v-if="showModal" class="fixed bottom-0 inset-x-0 px-3 pb-3 sm:inset-0 sm:flex sm:items-center sm:justify-center">
  <div class="fixed inset-0 transition-opacity">
    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
  </div>
  <div v-click-outside="closeModal" class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
    <div class="bg-white p-3">
      <div class="sm:flex sm:items-start">
        <div class="">
          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
            Delete account
          </h3>
          <div class="mt-2">
            <p class="text-sm lg:text-md leading-5 text-gray-800">
              Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="px-3 py-3 sm:px-3 flex justify-end">
      <span class="flex w-full rounded-md sm:mt-0 sm:w-auto mr-3 sm:mr-0">
        <button @click="closeModal" type="button"
          class="inline-flex justify-center w-full rounded border border-gray-300 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-base leading-6 font-medium text-gray-700 focus:outline-none focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
          Cancel
        </button>
      </span>
      <span class="flex w-full rounded-md sm:ml-3 sm:w-auto">
        <button @click="confirmDelete" type="button"
          class="inline-flex justify-center w-full rounded border border-transparent px-3 py-2 bg-red-500 text-base leading-6 font-medium text-white hover:bg-red-600 focus:outline-none focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
          Delete account
        </button>
      </span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['openModal'],
  computed: {
    showModal() {
      return this.openModal
    }
  },
  mounted() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    })
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    confirmDelete() {
      this.$emit('confirmDelete')
      this.closeModal()
    }
  }
}
</script>
