<script>
  export let id = 'selectElement'
  export let value = ''
  export let options = []
  export let defaultOption = {}
  $: if (defaultOption.id) {
    options.unshift(defaultOption)
  }
</script>

<select bind:value {id}>
  {#each options as option (option.id)}
    <option value={option.id}>{option.name}</option>
  {/each}
</select>
