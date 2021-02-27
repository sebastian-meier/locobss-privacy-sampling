<script lang="ts">
  import {niceNumbers} from '../../lib/utils';
  import { _, getMessageFormatter } from 'svelte-i18n';

  export let data: {
    [key: string]: {
    "value": number,
    "smallest": string[][]
    }
  } = {};
  export let attributes: string[] = [];

  let result: {
    key: string,
    value: number,
    groupCount: number
  } = {
    key: '',
    groupCount: 0,
    value: 0
  };

  const genKey = (keys: string[]): string => {
    const sorted = keys.sort();
    return sorted.join('_');
  }

  $: if (attributes.length > 0) {
    result.groupCount = data[genKey(attributes)].smallest.length;
    result.value = data[genKey(attributes)].value;
    result.key = data[genKey(attributes)].smallest.map((s) => {
      return s.map((ss) => (!isNaN(parseInt(ss))) ? ss : $_(ss)).join(': ');
    }).join(', ');
  }
</script>

<div class="result-container">
  <div class="result" class:filled={attributes.length > 0}>
    {#if attributes.length > 0}
    {$_('smallest_group_default_p1')} (<strong>{niceNumbers(result.value)}</strong>) {getMessageFormatter($_('smallest_group_default_p2')).format({count: result.groupCount})}: <strong>{result.key}</strong>
    {:else}
    {$_('choose_default')}
    {/if}
  </div>
</div>