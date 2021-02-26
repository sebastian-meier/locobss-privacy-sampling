<script lang="ts">
  import {niceNumbers} from '../../lib/utils';

  export let data: {
    [key: string]: {
      "values": {
        "local": number;
        "regional": number;
        "states": number;
        "federal": number;
      }
    }
  } = {};
  export let attributes: string[] = [];
  export let selection: string = '';

  let result: {
    key: string,
    value: number
  } = {
    key: '',
    value: 0
  };

  const genKey = (keys: string[]): string => {
    const sorted = keys.sort();
    return sorted.join('_');
  }

  $: if (selection !== '' && attributes.length > 0) {
    result.value = data[genKey(attributes)].values[selection];
  }

</script>

<div class="result-container">
  <div class="result" class:filled={selection !== '' && attributes.length > 0}>
    {#if selection !== '' && attributes.length > 0}
    With this selection the smallest group has the size of <strong>{niceNumbers(result.value)}</strong>.
    {:else}
    Please choose spatial granularity and at least one attribute.
    {/if}
  </div>
</div>