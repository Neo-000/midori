<template>
  <el-dialog
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    width="370px"
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="dialog-title">
        {{ isLogin ? $t('login') : $t('register') }}
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="login-form">
      <input v-model="email" :placeholder="$t('email')" required />
      <input v-model="password" :placeholder="$t('password')" type="password" required />
      <input
        v-if="!isLogin"
        v-model="name"
        :placeholder="$t('your_name')"
        required
        autocomplete="off"
      />
      <div v-if="error" class="error-msg">{{ error }}</div>
      <button type="submit" :disabled="loading">
        {{ loading ? $t('send') : isLogin ? $t('login_btn') : $t('register_btn') }}
      </button>
    </form>
    <div class="form-switch">
      <span>
        {{ isLogin ? $t('no_account') : $t('has_account') }}
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? $t('register_link') : $t('login_link') }}
        </a>
      </span>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../store/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'success'])

const email = ref('')
const password = ref('')
const name = ref('')
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const auth = useAuthStore()

watch(() => props.modelValue, (val) => {
  if (val) {
    email.value = ''
    password.value = ''
    name.value = ''
    error.value = ''
    loading.value = false
    isLogin.value = true
  }
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (isLogin.value) {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(email.value, password.value, name.value)
    }
    emit('success', auth.user)
    emit('update:modelValue', false)
  } catch (e) {
    error.value = e.message || t('order_error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}
input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}
button[type="submit"] {
  background: #409EFF;
  color: #fff;
  padding: 10px 0;
  border: none;
  border-radius: 7px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.error-msg {
  color: #d8231e;
  font-size: 14px;
  margin-bottom: 3px;
  margin-top: -5px;
}
.form-switch {
  font-size: 14px;
  text-align: center;
}
.form-switch a {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}
.dialog-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 0;
}
</style>
