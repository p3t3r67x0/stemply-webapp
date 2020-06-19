<template>
<div class="absolute w-full top-0 left-0 right-0 flex justify-center items-center">
  <div class="spinner text-right sm:text-center w-32">
    <div class="inline-block bg-blue-700 w-5 h-5 rounded-full" />
    <div class="inline-block bg-blue-700 w-5 h-5 rounded-full" />
    <div class="inline-block bg-blue-700 w-5 h-5 rounded-full" />
  </div>
</div>
</template>

<style>
.spinner>div {
  animation: spinner 1.4s infinite ease-in-out both;
}

.spinner div:nth-of-type(1) {
  animation-delay: -0.32s;
}

.spinner div:nth-of-type(2) {
  animation-delay: -0.16s;
}

@keyframes spinner {
  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1.0);
  }
}
</style>
