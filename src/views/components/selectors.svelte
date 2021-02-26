<script lang="typescript">
  import Select from './forms/select.svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { _ } from 'svelte-i18n';

  export let selectionLabel: string = '';
  export let selection: {
    id: string,
    name: string
  }[] = [];
  export let selected = '';
  export let attributes: {
    key: string;
    state: boolean;
  }[] = [];

  const uuid = uuidv4();

  const toggleState = (key: string) => {
    attributes.forEach((a, ai) => {
      if (a.key === key) {
        attributes[ai].state = !a.state;
      }
    });
  };

</script>
<div class="selection">
  <ul>
    {#if selection.length > 0}
    <li>
      <label for="selection_{uuid}">{selectionLabel}:</label>&nbsp;<Select
        id="selection_{uuid}"
        options={selection}
        bind:value={selected}
        />
    </li>
    {/if}
    {#each attributes as attribute, i (attribute.key)}
    <li>
      {#if i === 0}{$_('attributes')}:&nbsp;<br class="mobile-break" />{/if}
      <button on:click={() => toggleState(attribute.key)} class:selected={attribute.state} data-key={attribute.key}>{$_(attribute.key)}</button>
    </li>
    {/each}
  </ul>
</div>