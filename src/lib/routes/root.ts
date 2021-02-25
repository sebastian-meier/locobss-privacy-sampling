import Home from '../../views/pages/home.svelte'
import About from '../../views/pages/about.svelte'
import NotFound from '../../views/pages/404.svelte'

export const routes = {
  '/': Home,
  '/home': Home,
  '/about': About,
  '/404': NotFound,
  '*': NotFound,
}
