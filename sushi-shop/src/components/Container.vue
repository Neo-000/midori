<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped>
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
  box-sizing: border-box;
}
@media (max-width: 900px) {
  .container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
@media (max-width: 600px) {
  .container {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
