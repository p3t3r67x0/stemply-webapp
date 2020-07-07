<template>
<div class="py-10">
  <div class="container text-center mx-auto px-6">
    <h2 class="text-4xl font-bold text-black mb-2">
      {{ $t("welcome") }}
    </h2>
    <h3 class="text-2xl text-gray-800 mb-12">
      {{ $t("herotext") }}
    </h3>
    <nuxt-link :to="localePath('/signup')" class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider focus:outline-none">
      {{ $t("registernow") }}
    </nuxt-link>
  </div>
</div>
</template>

<script>
export default {}
</script>
