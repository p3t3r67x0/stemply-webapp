<template>
<div class="container mx-auto mt-3">
  <div class="mx-3 lg:mx-0">

    <div class="flex flex-wrap">
      <div class="w-full">
        <h2 class="px-12 text-base font-bold text-center md:text-4xl text-blue-700 mb-3">
          Choose your plan
        </h2>
        <p class="max-w-2xl mx-auto py-1 text-2xl text-center text-blue-700 mb-10">
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
        </p>
        <div class="flex flex-wrap items-center justify-center">
          <div @mouseenter="togglePlan('standard')" class="w-full p-4 md:w-1/3 lg:w-1/4 plan-card">
            <label class="flex flex-col rounded-lg shadow-lg group relative cursor-pointer">
              <div :class="[currentPlan == 'standard' ? 'bg-blue-500' : 'bg-white']" class="w-full px-4 py-6 rounded-t-lg bg-white">
                <h3 :class="[currentPlan == 'standard' ? 'text-white' : 'text-blue-500']" class="mx-auto text-base font-semibold text-center">
                  Standard
                </h3>
                <p :class="[currentPlan == 'standard' ? 'text-white' : 'text-blue-500']" class="text-5xl font-bold text-center">
                  25.<span class="text-3xl">95</span>
                </p>
                <p :class="[currentPlan == 'standard' ? 'text-white' : 'text-blue-500']" class="text-xs text-center uppercase">
                  monthly Plan
                </p>
              </div>
              <div :class="[currentPlan == 'standard' ? 'bg-blue-700' : 'bg-blue-500']" class="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg">
                <p class="text-xl text-white">
                  1 month
                </p>
                <button class="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Get Started
                </button>
              </div>
            </label>
          </div>

          <div @mouseenter="togglePlan('premium')" class="w-full p-4 md:w-1/3 lg:w-1/4">
            <label class="flex flex-col rounded-lg shadow-lg relative cursor-pointer">
              <div :class="[currentPlan == 'premium' ? 'bg-blue-500' : 'bg-white']" class="w-full px-4 py-8 rounded-t-lg">
                <h3 :class="[currentPlan == 'premium' ? 'text-white' : 'text-blue-500']" class="mx-auto text-base font-semibold text-center text-white group-hover:text-white">
                  Premium
                </h3>
                <p :class="[currentPlan == 'premium' ? 'text-white' : 'text-blue-500']" class="text-5xl font-bold text-center text-white">
                  21.<span class="text-3xl">95</span>
                </p>
                <p :class="[currentPlan == 'premium' ? 'text-white' : 'text-blue-500']" class="text-xs text-center uppercase text-white">
                  monthly Plan
                </p>
              </div>
              <div :class="[currentPlan == 'premium' ? 'bg-blue-700' : 'bg-blue-500']" class="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg">
                <p class="text-xl text-white">
                  3 months
                </p>
                <button class="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Save 15%
                </button>
              </div>
            </label>
          </div>

          <div @mouseenter="togglePlan('elite')" class="w-full p-4 md:w-1/3 lg:w-1/4 plan-card">
            <label class="flex flex-col rounded-lg shadow-lg group card-group relative hover:bg-jblue-secondary cursor-pointer">
              <div :class="[currentPlan == 'elite' ? 'bg-blue-500' : 'bg-white']" class="w-full px-4 py-6 rounded-t-lg bg-white">
                <h3 :class="[currentPlan == 'elite' ? 'text-white' : 'text-blue-500']" class="mx-auto text-base font-semibold text-center">
                  Elite
                </h3>
                <p :class="[currentPlan == 'elite' ? 'text-white' : 'text-blue-500']" class="text-5xl font-bold text-center text-white">
                  19.<span class="text-3xl">45</span>
                </p>
                <p :class="[currentPlan == 'elite' ? 'text-white' : 'text-blue-500']" class="text-xs text-center uppercase text-white">
                  monthly Plan
                </p>
              </div>
              <div :class="[currentPlan == 'elite' ? 'bg-blue-700' : 'bg-blue-500']" class="flex flex-col items-center justify-center w-full h-full py-6 rounded-b-lg bg-blue-500">
                <p class="text-xl text-white">
                  6 months
                </p>
                <button class="w-5/6 py-2 mt-2 font-semibold text-center uppercase bg-white border border-transparent rounded text-blue-500">
                  Save 25%
                </button>
              </div>
            </label>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      currentPlan: 'premium'
    }
  },
  methods: {
    togglePlan(plan) {
      this.currentPlan = plan
    }
  }
}
</script>
