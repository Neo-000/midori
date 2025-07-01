<template>
  <el-card shadow="hover" class="product-card">
    <img
      :src="product.img || '/src/assets/default-dish.png'"
      class="product-image"
      :alt="product.name"
    />
    <div class="product-info">
      <div class="product-title">{{ product.name }}</div>
      <div class="product-desc">{{ product.desc }}</div>
      <div class="product-meta">
        <span class="product-weight">{{ product.weight }}</span>
        <span class="product-price">{{ product.price }} ₽</span>
      </div>
      <el-button type="primary" size="small" class="add-btn">
        В корзину
      </el-button>
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  product: Object
})
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  min-height: 390px;
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  background: #fafafa;
}
.product-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.product-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}
.product-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 18px;
  min-height: 40px;
}
.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.product-weight {
  color: #999;
  font-size: 14px;
}
.product-price {
  font-size: 18px;
  font-weight: 600;
  color: #409EFF;
}
.add-btn {
  width: 100%;
}
</style>
