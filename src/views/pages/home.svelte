<script lang="typescript">
  import Selectors from '../components/selectors.svelte';
  import Result from '../components/result.svelte';
  import SpatialResult from '../components/SpatialResult.svelte';
  import Loader from '../components/Loader.svelte';
  import Pyramid from '../components/Pyramid.svelte';
  import { load, translations, ages, marital, nationality, spatial} from '../../stores/data';

  let loaded = false;
  load().then(() => {
    loaded = true;
  }).catch((err) => {
    console.log(err);
  });

  let selected_1 = '';
  let attributes_1 = [
    { key: 'age', label: 'Age', state: false},
    { key: 'gender', label: 'Gender', state: false},
    { key: 'nationality', label: 'Nationality', state: false}
  ];

  let attributes_2 = [
    { key: 'age', label: 'Age', state: false},
    { key: 'gender', label: 'Gender', state: false},
    { key: 'marital', label: 'Marital status', state: false},
    { key: 'nationality', label: 'Nationality', state: false}
  ];

  let attributes_3 = [
    { key: 'age', label: 'Age', state: false},
    { key: 'gender', label: 'Gender', state: false},
    { key: 'nationality', label: 'Nationality', state: false}
  ];

  $: l_spatial = $spatial;
  $: l_nationality = $nationality;
  $: l_marital = $marital;
  $: l_ages = $ages;
</script>

<h1>Collecting data &amp; protecting individual privacy</h1>
<h2>How to identify individuals through their attributes in anonymized data</h2>
<span class="subline">This demonstration was build to accompany a government survey development guideline.<br />The full guideline is available <a href="https://www.github.com/sebastian-meier/locobss-documentation">here</a>.</span>

<p class="intro">
  Surveys often need to anonymize their data, which in many cases means, that "personal" information is removed. In most cases this only focusses on things like names, contact information or a personal adress. But usually it is not concerned with all the other attributes that a survey collects. But depending on the distribution of collected attributes across the observed population, those attributes could still give away an individuals identity, when for example, cross-referenced with an additional data-set. Therefore, it is important to choose those attributes wisely to ensure individuals cannot be identified through their attributes.
</p>

<!-- An easy solution to overcome this problem is to create so called bins or buckets inside attributes, for example, instead of collecting the exact age of participants, only collect age groups. Instead of using for example a 10-year-interval, one could size the intervals, so that each bin holds the same amount of people in the observed population.  -->

<h3>Spatial resolution</h3>
<p>The more fine granular the data, the easier it gets to identify an individual. To demonstrate this, the first example offers the same attributes on different spatial granularity levels.</p>
<p class="instructions">
  Select a spatial granularity and select which attributes you want to collect, the system will then tell you what the smallest group inside the data is.
</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  selectionLabel="Spatial Granularity" 
  selection={[{id: '', name: 'Please Choose'}, {id: 'federal', name: 'Federal'}, {id:'states', name:'States'}, {id:'regional', name:'Regional'}, {id: 'local', name: 'Local'}]}
  bind:selected={selected_1}
  bind:attributes={attributes_1} />
<SpatialResult 
  attributes={attributes_1.filter((a) => a.state).map((a) => a.key)}
  data={l_spatial}
  selection={selected_1} />
{/if}
<p class="data-description">Dataset: 21 age groups, 2 gender groups, 2 nationality groups</p>

<h3>Nationality</h3>
<p>Groups' sizes which are too small and, thereby, do not conform to your privacy goals, are not only derived from spatial units. This next example splits up nationalities into 125 groups and, thereby, creating groups that even go down to one individual. So if you meet a woman from Benin, 65 or older, she is one of a kind in German.</p>
<p class="instructions">
  Combine attributes and the system will tell you what the smallest group inside the data is.
</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  bind:attributes={attributes_3} />
<Result 
  attributes={attributes_3.filter((a) => a.state).map((a) => a.key)}
  data={l_nationality} />
{/if}
<p class="data-description">Dataset: 11 age groups, 2 gender groups, 125 nationality groups</p>

<h3>Marital status</h3>
<p>In this last example the high granularity lies on the attribute ages, combined with the attribute martial status, which can be very sparse at the outer ends of the age spectrum, this generates a lot of small cases.</p>
<p class="instructions">
  Combine attributes and the system will tell you what the smallest group inside the data is.
</p>
{#if !loaded}
<Loader />
{:else}
<Selectors 
  bind:attributes={attributes_2} />
<Result 
  attributes={attributes_2.filter((a) => a.state).map((a) => a.key)}
  data={l_marital} />
{/if}
<p class="data-description">Dataset: 86 age groups, 2 gender groups, 2 nationality groups, 7 marital status groups</p>

<h3>Age groups</h3>
<p style="padding-bottom:20px;">The number of classes (bins, buckets, groups, etc.) per attribute have a strong impact on the size of groups found in a dataset. You can even use groups across your dimensions to overcome this problem. Identifying small groups and combining them with bigger groups ensures the privacy of individuals in smaller groups. <i>If you create your groups, make sure you look beyond indivdiual attributes, as this site tried to highlight.</i> To highlight the impact of such binning approaches, we end this article with showing four age pyramids, starting with a pyramid that groups by individual year and then the data for the three examples on this site with varying groups.</p>
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

<h3>Other methods to collect attributes</h3>
<p>There are also other technical methods of "distorting" or rather "diffusing" attribute data. Following, a few papers on such techniques, this list is not exhaustive and should be seen as a starting point for further investigation:</p>
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

<h3>Attribution</h3>
<p style="padding-bottom:10px;">Hand-icon (right) by <a href="https://thenounproject.com/desbenoit/uploads/?i=5380">Desbenoit</a> from the Noun Project</p>
<p>The data in the examples are all from the German statistical offices or the statistical offices of states (Statistische Ämter des Bundes und der Länder, Deutschland, 2021). Sadly deeplinks are not possible, but you can find the raw data on either <a href="https://www.regionalstatistik.de">Regionalstatistik</a> or <a href="https://www-genesis.destatis.de/genesis/online">Destatis</a></p>