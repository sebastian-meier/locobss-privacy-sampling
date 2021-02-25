<script lang="ts">
  import {link, location} from 'svelte-spa-router';
  
  export let menu: { url: string, label: string, protected: boolean}[] = [];

  $: cLocation = $location;

</script>

<ul>
  {#each menu as item}
  <li>
    <a href="{item.url}" class:active="{(item.url !== '/' && cLocation.indexOf(item.url) === 0) || (item.url === '/' && cLocation === item.url)}" use:link>{item.label}</a>
  </li>
  {/each}
</ul>