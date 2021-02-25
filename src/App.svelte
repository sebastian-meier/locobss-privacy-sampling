<script>
  import Router from 'svelte-spa-router'
  import Footer from './views/layout/footer.svelte'
  import Header from './views/layout/header.svelte'
  import { routes } from './lib/routes/root'
</script>

<Header />
<main>
  <Router {routes} />
</main>
<Footer />

<style lang="scss" global>
	@import 'styles/vars';
	@import 'styles/global';
  @import 'styles/header';
  @import 'styles/footer';
</style>