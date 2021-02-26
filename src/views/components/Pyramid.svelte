<script lang="ts">
  import {scaleLinear, max, axisBottom, select} from 'd3';
  import {v4 as uuid4} from 'uuid';
  import { _ } from 'svelte-i18n';

  export let data:{
    "key":number;
    "label": (string | number)[];
    "value":number;
  }[] = [];

  export let labelLimit:number = 1;

  let graphWidth:number = 0;
  let graphHeight: number = 0;

  const padding = {
    top: 10,
    left: 100,
    right: 10,
    bottom: 30,
    inBetween: 2
  };

  $: maxX = max(data, (d) => d.value);
  $: xScale = scaleLinear().domain([0, maxX]).range([0, graphWidth - padding.left - padding.right]);
  $: yScale = scaleLinear().domain([0, data.length]).range([padding.top, graphHeight - padding.bottom]);
  $: barHeight = (graphHeight - padding.top - padding.bottom) / data.length - padding.inBetween;

  $: axis = axisBottom(xScale).ticks(3);
  $: {
    select(`#pyramidBottomAxis_${uuid} *`).remove();
    select(`#pyramidBottomAxis_${uuid}`).call(axis);
  }

  const uuid = uuid4();
</script>

<div id="pyramid_{uuid}" class="svg-container pyramid" bind:clientWidth={graphWidth} bind:clientHeight={graphHeight}>
  <svg>
    {#each data as d, i}
      <g transform="translate({padding.left}, {yScale(i)})">
        {#if i%labelLimit === 0}<text text-anchor="end" dx="-5" dy="{barHeight / 2 + 2}">{d.label.map((l) => {
          if (isNaN(parseInt(l.toString()))) {
            return $_(l.toString());
          }
          return l;
        }).join(' ')}</text>{/if}
        <rect height={barHeight} width={xScale(d.value)} />
      </g>
    {/each}
    <g id="pyramidBottomAxis_{uuid}" transform="translate({padding.left} {graphHeight-padding.bottom + 5})"></g>
  </svg>
</div>