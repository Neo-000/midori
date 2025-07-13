import { createI18n } from 'vue-i18n'

import ru from './locales/ru.json'
import rs from './locales/rs.json'

export const i18n = createI18n({
  legacy: false, // если ты используешь composition API
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru,
    rs
  }
})
