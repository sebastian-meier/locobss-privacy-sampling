<script lang="ts">
  import {niceNumbers} from '../../lib/utils';
  import {translations} from '../../stores/data';

  export let data: {
    [key: string]: {
    "value": number,
    "smallest": string[][]
    }
  } = {};
  export let attributes: string[] = [];

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

  $: if (attributes.length > 0) {
    result.value = data[genKey(attributes)].value;
    result.key = data[genKey(attributes)].smallest.map((s) => {
      return s.map((ss) => (ss in $translations) ? $translations[ss] : ss).join(': ');
    }).join(', ');
  }
</script>

<div class="result-container">
  <div class="result" class:filled={attributes.length > 0}>
    {#if attributes.length > 0}
    The smallest number of cases (<strong>{niceNumbers(result.value)}</strong>) occurs in the group of: <strong>{result.key}</strong>
    {:else}
    Please choose at least one attribute.
    {/if}
  </div>
</div>