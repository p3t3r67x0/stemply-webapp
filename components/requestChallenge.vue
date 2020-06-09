<template>
<div class="modal modal-active fixed w-full h-screen top-0 left-0 flex items-center justify-center">
  <div class="modal-overlay absolute w-full h-screen bg-gray-900 opacity-50" @click="closeModal"></div>

  <div class="modal-container bg-white lg:mx-16 sm:mx-2 md:mx-5 rounded shadow-lg z-50">
    <div class="modal-content py-4 text-left px-6" style="height: 95vh">
      <div class="flex justify-between items-center pb-3">
        <p class="text-2xl font-bold" v-if="challenge">{{ challenge.title }}</p>
        <div class="modal-close cursor-pointer z-50" v-on:click="closeModal">
          <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </div>
      </div>
      <h3 class="text-center text-2xl m-1 mb-3">Request access to challenges</h3>
      <hr>
      <div class="xl:flex mt-5 m-2">
        <ul>
          <li v-for="challenge, key in challenges" v-if="uclist.includes(challenge._id) == false":key="challenge._id" class="lg:flex justify-between width odd:bg-gray-100 even:bg-gray-200 px-2 py-3">
            <div class="flex justify-between mr-3 mb-3 lg:mb-0">
              <span>
                  {{ challenge.title }}
                <span class="lg:hidden text-gray-600">
                  ({{ $t('duration') }}: {{ challenge.duration }} {{ $tc('days', challenge.duration != 1 ? 0 : 1)}})
                </span>
              </span>
            </div>
            <span class="hidden lg:inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">{{ $t('duration') }}: {{ challenge.duration }}
              {{ $tc('days', challenge.duration != 1 ? 0 : 1)}}</span>
              <div class="-m-1">
                <button class="px-4 bg-indigo-500 rounded-lg p-1 text-white hover:bg-indigo-400" v-on:click="requestAccess(challenge._id)">Request access</button>
              </div>
          </li>
        </ul>
      </div>
      <div class="flex justify-end mt-32 pt-2">
        <button class="modal-button-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400" v-on:click="closeModal">Close</button>
      </div>

    </div>
  </div>
</div>
</template>
<style scoped>
.width {
  width: 70vw
}
.modal-button-close {
  position: fixed;
  bottom: 12mm;
}
@media (min-width: 1280px) {
  .modal-text {
    height: 75vh !important;
  }

  .modal-tasks {
    height: 35vh !important;
  }
}

.block-modal {
  display: block !important;
}
</style>
<script>
import VueMarkdownPlus from 'vue-markdown-plus'

export default {
  data() {
    return {
      statusClass: "",
      progressChanged: 0,
      challenges: [],
      userchallenges: []
    }
  },
  props: ['userchallenges'],
  computed: {},
  created() {
    this.$axios.$get(process.env.API_URL + '/api/v1/challenge').then(res => {
      this.challenges = res.message
    }).catch(error => {
      if (error.hasOwnProperty('response')) {
        console.log(error.response.data.message)
      } else {
        console.log(error)
      }
    })
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
      this.$emit('clicked', false)
    },
    requestAccess(challengeid) {
      this.$axios.$post(process.env.API_URL + '/api/v1/challenge/request', {
        id: challengeid
      })
    }
  },
  computed: {
    uclist: function() {
      var array = []
      this.userchallenges.forEach(challenge => { array.push(challenge._id) })
      return array
    }
  },
  components: {
    VueMarkdownPlus
  }
}
</script>
