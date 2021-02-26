<script lang="typescript">
  import Selectors from '../components/selectors.svelte';
  import Result from '../components/result.svelte';
  import SpatialResult from '../components/SpatialResult.svelte';
  import Loader from '../components/Loader.svelte';
  import Pyramid from '../components/Pyramid.svelte';
  import { load, ages, marital, nationality, spatial} from '../../stores/data';
  import { _ } from 'svelte-i18n';

  let loaded = false;
  load().then(() => {
    loaded = true;
  }).catch((err) => {
    console.log(err);
  });

  let selected_1 = '';
  let attributes_1 = [
    { key: 'age', state: false},
    { key: 'gender', state: false},
    { key: 'nationality', state: false}
  ];

  let attributes_2 = [
    { key: 'age', state: false},
    { key: 'gender', state: false},
    { key: 'marital', state: false},
    { key: 'nationality', state: false}
  ];

  let attributes_3 = [
    { key: 'age', state: false},
    { key: 'gender', state: false},
    { key: 'nationality', state: false}
  ];

  $: l_spatial = $spatial;
  $: l_nationality = $nationality;
  $: l_marital = $marital;
  $: l_ages = $ages;
</script>

<h1>{@html $_('h1')}</h1>
<h2>{$_('h2')}</h2>
<span class="subline">{@html $_('subline')}</span>

<p class="intro">{@html $_('intro')}</p>

<h3>{$_('ch1_h3')}</h3>
<p>{@html $_('ch1_intro')}</p>
<p class="instructions">{@html $_('ch1_instructions')}</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  selectionLabel={$_('ch1_h3')} 
  selection={[{id: '', name: $_('please_choose')}, {id: 'federal', name: $_('federal')}, {id:'states', name: $_('states')}, {id:'regional', name: $_('regional')}, {id: 'local', name: $_('local')}]}
  bind:selected={selected_1}
  bind:attributes={attributes_1} />
<SpatialResult 
  attributes={attributes_1.filter((a) => a.state).map((a) => a.key)}
  data={l_spatial}
  selection={selected_1} />
{/if}
<p class="data-description">{@html $_('ch1_dataset')}</p>

<h3>{$_('ch2_h3')}</h3>
<p>{@html $_('ch2_intro')}</p>
<p class="instructions">{@html $_('ch2_instructions')}</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  bind:attributes={attributes_3} />
<Result 
  attributes={attributes_3.filter((a) => a.state).map((a) => a.key)}
  data={l_nationality} />
{/if}
<p class="data-description">{@html $_('ch2_dataset')}</p>

<h3>{$_('ch3_h3')}</h3>
<p>{@html $_('ch3_intro')}</p>
<p class="instructions">{@html $_('ch3_instructions')}</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  bind:attributes={attributes_2} />
<Result 
  attributes={attributes_2.filter((a) => a.state).map((a) => a.key)}
  data={l_marital} />
{/if}
<p class="data-description">{@html $_('ch3_dataset')}</p>

<h3>{$_('ch4_h3')}</h3>
<p style="padding-bottom:20px;">{@html $_('ch4_intro')}</p>
<div class="columns">
  <div>
    <Pyramid data={l_ages[3]} labelLimit={5} />
  </div>
  <div class="gap"></div>
  <div>
    <Pyramid data={l_ages[1]} labelLimit={5} />
  </div>
</div>
<div class="columns">
  <div>
    <Pyramid data={l_ages[0]} />
  </div>
  <div class="gap"></div>
  <div>
    <Pyramid data={l_ages[2]} />
  </div>
</div>

<hr class="article-end" />

<h3>{$_('ch5_h3')}</h3>
<p>{@html $_('ch5_intro')}</p>
<ul class="references">
  <li>
    Cynthia Dwork, Frank McSherry, Kobbi Nissim, Adam Smith (2020) <i>Calibrating Noise to Sensitivity in Private Data Analysis</i><br />
    <a href="https://journalprivacyconfidentiality.org/index.php/jpc/article/view/405">https://journalprivacyconfidentiality.org/index.php/jpc/article/view/405</a>
  </li>
  <li>
    Wanrong Zhang, Olga Ohrimenko, Rachel Cummings (2020) <i>Attribute Privacy: Framework and Mechanisms</i><br />
    <a href="https://arxiv.org/pdf/2009.04013.pdf">https://arxiv.org/pdf/2009.04013.pdf</a>
  </li>
  <li>
    Abdul Majeed (2019) <i>Attribute-centric anonymization scheme for improving user privacy and utility of publishing e-health data</i><br />
    <a href="https://www.sciencedirect.com/science/article/pii/S1319157817304093">https://www.sciencedirect.com/science/article/pii/S1319157817304093</a>
  </li>
</ul>

<h3>{$_('ch6_h3')}</h3>
<p style="padding-bottom:10px;">{@html $_('ch6_p1')}</p>
<p>{@html $_('ch6_p2')}</p>