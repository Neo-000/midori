<template>
  <div class="product-card">
    <div class="product-img-wrap">
      <img
        :src="getImgUrl(product.image)"
        class="product-image"
        :alt="product.title"
      />
    </div>
    <div class="product-info">
      <div>
        <div class="product-title">
          {{ product.title }}
          <span class="product-weight" v-if="product.weight">
            {{ product.weight }} г
          </span>
        </div>
        <div class="product-desc">{{ product.description }}</div>
      </div>
      <div class="product-bottom">
        <span class="product-price">{{ product.price }} ₽</span>
        <button class="add-btn" @click="addToCart">
          В корзину
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { STATIC_BASE_URL } from '../constants'
import { useCartStore } from '../store/cart'
import { ElMessage } from 'element-plus'

const props = defineProps({ product: Object })
const cart = useCartStore()

function addToCart() {
  cart.add(props.product)
  ElMessage.success('Добавлено в корзину!')
}

function getImgUrl(img) {
  if (!img) return '/src/assets/default-dish.png'
  if (img.startsWith('/uploads')) return STATIC_BASE_URL + img
  if (img.startsWith('http')) return img
  return STATIC_BASE_URL + '/uploads/' + img
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.1em;
  box-shadow: 0 2px 10px #edf2fdc9;
  background: #fff;
  min-width: 220px;
  max-width: 315px;
  min-height: 340px;
  max-height: 420px;
  margin: 0 auto;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.product-img-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fafaff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.1em 1.1em 0 0;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1em 1em 0.8em 1em;
  flex: 1 1 0;
  min-width: 0;
}

.product-title {
  font-size: 1.09em;
  font-weight: 600;
  margin-bottom: 0.4em;
  display: flex;
  align-items: center;
  gap: 0.6em;
}

.product-weight {
  color: #aaa;
  font-size: 0.97em;
  font-weight: 400;
}

.product-desc {
  font-size: 0.97em;
  color: #5c5c5c;
  margin-bottom: 0.7em;
  min-height: 1.4em;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.2em;
}

.product-price {
  font-size: 1.13em;
  font-weight: bold;
  color: #222;
  letter-spacing: 0.3px;
}

.add-btn {
  background: #eef3fd;
  color: #9e8bee;
  font-weight: 500;
  border-radius: 0.85em;
  border: none;
  font-size: 1em;
  padding: 0.65em 1.7em;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  margin-left: 1em;
}
.add-btn:hover {
  background: #dbeaff;
  color: #4d49ad;
}

@media (max-width: 650px) {
  .product-card {
    flex-direction: row;
    align-items: stretch;
    min-width: 0;
    max-width: 100vw;
    height: 110px;
    min-height: 95px;
    max-height: 130px;
    margin: 0;
    margin-bottom: 20px;
  }
  .product-img-wrap {
    width: 34vw;
    min-width: 88px;
    max-width: 108px;
    height: 100%;
    border-radius: 1.1em 0 0 1.1em;
  }
  .product-info {
    flex: 1 1 0;
    min-width: 0;
    padding: 0.7em 1em 0.7em 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .product-title {
    font-size: 1em;
    margin-bottom: 0.2em;
  }
  .product-desc {
    font-size: 0.95em;
    -webkit-line-clamp: 1;
    margin-bottom: 0.3em;
  }
  .product-bottom {
    margin-top: 0;
    align-items: flex-end;
  }
  .add-btn {
    min-width: 84px;
    padding: 0.55em 1em;
    margin-left: 1em;
    font-size: 0.99em;
  }
}
</style>
