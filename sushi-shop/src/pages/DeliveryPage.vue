<template>
  <div class="delivery-page">
    <div class="city-road-wrap">
      <!-- Фон города — background, а не <svg>! -->
      <div :class="['city-bg', { 'city-bg-moving': bgMoving }]" />
      <!-- Машинка -->
      <transition name="car-anim">
        <div v-if="carVisible" class="car-anim-over-road">
          <!-- ... SVG как есть ... -->
          <!-- SVG не трогал -->
        </div>
      </transition>
    </div>
    <div class="delivery-content">
      <h1>{{ $t('delivery_title') }}</h1>
      <p>
        <b>Midori Sushi</b> — {{ $t('delivery_subtitle') }}
      </p>
      <div class="delivery-info">
        <h2>{{ $t('delivery_terms_title') }}</h2>
        <ul>
          <li><b>{{ $t('delivery_city') }}</b> {{ $t('delivery_city_descr') }}</li>
          <li><b>{{ $t('delivery_cost') }}</b> {{ $t('delivery_cost_descr') }}</li>
          <li><b>{{ $t('delivery_time') }}</b> {{ $t('delivery_time_descr') }}</li>
          <li><b>{{ $t('delivery_payment') }}</b> {{ $t('delivery_payment_descr') }}</li>
          <li><b>{{ $t('delivery_order') }}</b> {{ $t('delivery_order_descr') }}</li>
        </ul>
      </div>
      <div class="delivery-contacts">
        <p>{{ $t('delivery_questions') }}</p>
        <div class="contacts-list">
          <a href="tel:+381638888888" class="phone">+381 63 888 88 88</a>
          <a href="https://t.me/donnahenna" target="_blank" class="tg">Telegram: @donnahenna</a>
          <a href="https://www.instagram.com/midorisushi.novisad" target="_blank" class="ig">Instagram</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const carVisible = ref(false)
const bgMoving = ref(false)
onMounted(() => {
  setTimeout(() => {
    carVisible.value = true
    setTimeout(() => {
      bgMoving.value = true
    }, 500)
  }, 100)
})
</script>

<style scoped>
.delivery-page {
  max-width: 650px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem 1rem;
  background: #fffefc;
  border-radius: 22px;
  box-shadow: 0 6px 40px #c9cfd82e;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.city-road-wrap {
  position: relative;
  width: 100%;
  min-height: 130px;
  margin-bottom: 24px;
  overflow: hidden;
}
.city-bg {
  width: 100%;
  height: 130px;
  position: absolute;
  left: 0; top: 0;
  z-index: 0;
  pointer-events: none;
  display: block;
  /* ключ! */
  background-image: url('../assets/fon.svg');
  background-repeat: repeat-x;
  background-size: auto 130px;
  background-position-x: 0;
  transition: background-position-x 0.2s;
}
.city-bg-moving {
  animation: city-bg-move 6s linear infinite;
}
@keyframes city-bg-move {
  from { background-position-x: 0; }
  to   { background-position-x: -640px; }
}
.car-anim-over-road {
  position: absolute;
  left: 32px;
  bottom: 8px;
  z-index: 2;
  width: 120px;
  height: 70px;
}
.wheel {
  animation: spin 1.2s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.car-anim-enter-from {
  opacity: 0;
  transform: translateX(-180px) scale(0.95);
}
.car-anim-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}
.car-anim-enter-active {
  transition: transform 1.1s cubic-bezier(.35,1.56,.64,1), opacity 1s;
}
.delivery-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 18px;
  color: #a00c18;
  font-family: 'Rubik', 'Montserrat', Arial, sans-serif;
}
.delivery-info {
  margin: 30px 0 16px 0;
  background: #fff7f2;
  border-left: 4px solid #a00c18;
  border-radius: 8px;
  padding: 1.2em 1.5em;
}
.delivery-info h2 {
  font-size: 1.12em;
  margin-bottom: 0.5em;
  color: #a00c18;
}
.delivery-info ul {
  margin: 0; padding: 0; list-style: none;
}
.delivery-info li {
  margin-bottom: 7px;
  position: relative;
  padding-left: 1.4em;
}
.delivery-info li::before {
  content: "🍣";
  position: absolute;
  left: 0; top: 0;
}
.delivery-contacts {
  margin-top: 18px;
  padding-top: 10px;
  border-top: 1px dashed #ffb5c3;
  text-align: center;
}
.contacts-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
}
.contacts-list a {
  color: #a00c18;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.08em;
  transition: color 0.15s;
}
.contacts-list a:hover { color: #2db06c; }
@media (max-width: 540px) {
  .delivery-page {
    max-width: 100vw;
    padding: 0.8rem 2vw;
    border-radius: 0;
    box-shadow: none;
  }
  h1 { font-size: 1.23rem; }
  .city-road-wrap { min-height: 100px; }
  .city-bg { height: 100px; background-size: auto 100px;}
  .car-anim-over-road { width: 95px; height: 56px; left: 10px; }
  .delivery-info { padding: 0.7em 0.7em; }
}
</style>
