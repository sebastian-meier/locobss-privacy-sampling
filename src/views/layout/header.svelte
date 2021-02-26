<script lang="ts">
  import { locale, locales } from 'svelte-i18n';

  const switchLang = (lang: string) => {
    $locale = lang;
  };

  $: l_locale = $locale;
</script>

<header>
  <span id="logo">LoCobSS</span>
  <ul id="menu-lang">
  {#each $locales as locale}
    <li on:click={() => {switchLang(locale)}} class:selected={l_locale===locale}>{locale}</li>
  {/each}
  </ul>
</header>