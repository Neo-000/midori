<template>
  <el-dialog
    v-model="visible"
    :width="dialogWidth"
    :title="$t('choose_address')"
    @close="onClose"
    class="address-dialog"
    append-to-body
  >
    <div class="address-modal-content">
      <el-form label-width="90px" label-position="top">
        <el-form-item :label="$t('city')">
          <el-input v-model="address.city" readonly />
        </el-form-item>
        <el-form-item :label="$t('street')">
          <el-input v-model="address.street" :placeholder="$t('street_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('house')">
          <el-input v-model="address.house" :placeholder="$t('house_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('apartment')">
          <el-input v-model="address.apartment" :placeholder="$t('apartment_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('entrance')">
          <el-input v-model="address.entrance" :placeholder="$t('entrance_placeholder')" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onSave" :disabled="!address.street || !address.house">
        {{ $t('save') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'addressSelected'])

const address = ref({
  city: 'Нови Сад',
  street: '',
  house: '',
  apartment: '',
  entrance: ''
})

const visible = ref(props.modelValue)
watch(() => props.modelValue, v => visible.value = v)
watch(visible, v => emit('update:modelValue', v))

onMounted(() => {
  const saved = localStorage.getItem('deliveryAddress')
  if (saved) Object.assign(address.value, JSON.parse(saved))
})

function onSave() {
  localStorage.setItem('deliveryAddress', JSON.stringify(address.value))
  emit('addressSelected', address.value)
  visible.value = false
}
function onClose() {
  visible.value = false
}

// Динамически подбираем ширину диалога
const dialogWidth = computed(() => (window.innerWidth < 550 ? '98vw' : '420px'))
</script>

<style scoped>
.address-dialog >>> .el-dialog {
  border-radius: 14px;
  max-width: 420px;
  width: 100%;
  min-width: 240px;
  padding: 0;
}

.address-modal-content {
  padding: 12px 6px 0 6px;
}

@media (max-width: 600px) {
  .address-dialog >>> .el-dialog {
    max-width: 98vw !important;
    min-width: unset !important;
    margin: 0 !important;
    border-radius: 11px;
  }
  .address-modal-content {
    padding: 6px 2px 0 2px;
  }
  .el-form-item__label {
    font-size: 15px !important;
    padding-bottom: 2px;
  }
}
.el-form-item {
  margin-bottom: 8px;
}
.el-input__inner {
  font-size: 16px;
  min-height: 38px;
}
</style>
