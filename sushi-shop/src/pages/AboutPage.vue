<template>
  <div class="about-page">
    <div class="about-header">
      <h1>{{ $t('about_title') }}</h1>
      <p v-html="$t('about_header_p1')"></p>
    </div>
    <div class="about-block">
      <h2>{{ $t('contacts') }}</h2>
      <div class="contacts">
        <a href="https://www.facebook.com/profile.php?id=100034549010690&mibextid=ZbWKwL" target="_blank">
          {{ $t('facebook') }}
        </a>
        <a href="https://t.me/donnahenna" target="_blank">
          {{ $t('telegram') }}
        </a>
        <a href="https://www.instagram.com/midorisushi.novisad?igsh=MXVjczg5OWFuZ2Iwbw==" target="_blank">
          {{ $t('instagram') }}
        </a>
      </div>
    </div>

    <div class="about-block">
      <h2>{{ $t('friend_sites') }}</h2>
      <ul class="friend-sites">
        <li>
          <a href="http://lc.kubagro.ru/Source_data_applications/Nata/index.htm" target="_blank">
            {{ $t('natalia_art') }}
          </a>
        </li>
        <li>
          <a href="http://rocket2009.byethost22.com/?i=1" target="_blank">
            {{ $t('nikita_kids') }}
          </a>
        </li>
        <li>
          <a href="http://nickup.byethost22.com/" target="_blank">
            {{ $t('nikita_actual') }}
          </a>
        </li>
        <li>
          <a href="http://lc.kubagro.ru/" target="_blank">
            {{ $t('prof_lutsenko') }}
          </a>
        </li>
      </ul>
    </div>

    <div class="about-footer">
      <p>{{ $t('about_feedback') }}</p>
      <p class="signature">{{ $t('signature') }}</p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2.2em 1em 2em 1em;
  background: #fcfcfc;
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 #3e4c6012;
  font-family: 'Montserrat', 'Arial', sans-serif;
  color: #1c2636;
}

.about-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #38b000;
  margin-bottom: 0.5em;
}

.about-header p {
  font-size: 1.15em;
  color: #42506e;
  margin-bottom: 1.7em;
  line-height: 1.7;
}

.about-block {
  margin-bottom: 2em;
  background: #f5faff;
  border-radius: 13px;
  padding: 1.1em 1.3em;
  box-shadow: 0 2px 12px 0 #c8e0f922;
}

.about-block h2 {
  font-size: 1.2em;
  color: #2186eb;
  margin-bottom: 0.9em;
}

.contacts {
  display: flex;
  gap: 1.2em;
  flex-wrap: wrap;
}

.contacts a {
  font-size: 1.04em;
  color: #2278c9;
  background: #e8f3ff;
  padding: 0.38em 1.05em;
  border-radius: 7px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 8px #bbdefb0a;
  transition: background 0.13s, color 0.13s;
}

.contacts a:hover {
  background: #2186eb;
  color: #fff;
}

.friend-sites {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}

.friend-sites a {
  color: #38b000;
  text-decoration: none;
  font-size: 1em;
  font-weight: 500;
  transition: color 0.14s;
}

.friend-sites a:hover {
  color: #2278c9;
  text-decoration: underline;
}

.about-footer {
  margin-top: 2em;
  padding-top: 1em;
  border-top: 1px solid #e7e7e7;
  color: #42506e;
  font-size: 1.03em;
}

.signature {
  margin-top: 0.7em;
  color: #38b000;
  font-weight: 600;
  font-size: 1.11em;
}

/* Адаптивность */
@media (max-width: 600px) {
  .about-page {
    max-width: 100vw;
    padding: 1.3em 0.2em 1.3em 0.2em;
    border-radius: 0;
  }
  .about-block {
    padding: 0.85em 0.7em;
  }
}
</style>
