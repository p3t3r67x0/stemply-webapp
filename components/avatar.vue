<template>
<div class="pt-5">
  <img ref="avatar" class="bg-white text-center w-48 h-48 mx-auto leading-6 border border-gray-200 rounded-full mb-5" :src="userAvatar" alt="Avatar">
  <small class="block text-center ">Pro Account</small>
  <h1 class="text-md text-center mb-4">{{ userName }}</h1>
  <form enctype="multipart/form-data" class="flex justify-center items-center">
    <label class="w-48 h-12 flex flex-col items-center rounded bg-gray-700 hover:bg-gray-800 text-white cursor-pointer">
      <span class="mt-3 text-base leading-normal">Upoad avatar</span>
      <input @change="setImage" ref="file" type="file" accept="image/*" class="hidden">
    </label>
  </form>
  <hr class="my-8 border-b border-gray-400">
</div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import ImageHandler from '@/plugins/imageHandler'

export default {
  data() {
    return {}
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
    this.getAvatar()
  },
  methods: {
    getAvatar() {
      this.$axios.$get(process.env.API_URL + '/static/' + this.userAvatarUrl, {
        responseType: 'blob'
      }).then(res => {
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
