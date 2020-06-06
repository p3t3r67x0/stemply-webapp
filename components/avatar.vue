<template>
<div class="pt-5">
  <img ref="avatar" class="bg-white text-center w-48 h-48 mx-auto leading-6 border border-gray-200 rounded-full mb-5" :src="userAvatar" alt="Avatar">
  <small class="block text-center ">Pro Account</small>
  <h1 class="text-md text-center mb-4">{{ userName }}</h1>
  <form enctype="multipart/form-data" class="flex justify-center items-center">
    <button type="button" class="w-48 h-12 bg-gray-700 hover:bg-gray-800 rounded focus:outline-none focus:shadow-outline relative cursor-pointer">
      <input @change="setImage" ref="file" type="file" class="w-48 h-12 overflow-hidden opacity-0 absolte cursor-pointer" accept="image/*">
      <span class="pointer-events-none absolute top-0 left-0 z-20 w-48 h-12 text-white font-medium leading-tight text-center cursor-pointer p-3">Upoad avatar</span>
    </button>
  </form>
  <hr class="my-8 border-b border-gray-400">
</div>
</template>

<script>
import ImageHandler from '@/plugins/imageHandler'

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  data() {
    return {
      statusCode: null,
      infoMessage: null,
      showImages: false,
      showModal: false
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    },
    userName() {
      return this.$store.state.userName
    },
    userAvatar() {
      return this.$store.state.userAvatar
    },
    userAvatarUrl() {
      return this.$store.state.userAvatarUrl
    }
  },
  created() {
    console.log('wurde aufgerufen')
    this.getAvatar()
  },
  methods: {
    getAvatar() {
      this.$axios.$get(process.env.API_URL + '/static/' + this.userAvatarUrl, {
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        const vm = this
        let reader = new window.FileReader()
        reader.readAsDataURL(res)
        reader.onload = function() {
          vm.$refs.avatar.src = reader.result
          vm.$store.commit('updateUserAvatar', reader.result)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    setImage(e) {
      const images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : []
      let i

      if (images && images.length) {
        for (i in images) {
          if (typeof images[i] !== 'object') continue
          const image = new Image()
          const vm = this

          image.src = ImageHandler.createObjectURL(images[i])
          image.onload = function(e) {
            const avatarUrl = process.env.API_URL + '/api/v1/user/avatar/' + vm.userId
            const imageResized = ImageHandler.resizeCrop(e.target, 800, 800).toDataURL('image/png')
            vm.$refs.avatar.src = imageResized
            const data = new FormData()
            data.append('file', ImageHandler.dataURItoBlob(imageResized))

            vm.$axios.$post(avatarUrl, data, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((res) => {
              console.log(res)
              vm.$store.commit('updateUserAvatarUrl', res.avatar)
            }).catch((error) => {
              console.log(error)
            })
          }
        }
      }
    }
  }
}
</script>
