import Home from '../../views/pages/home.svelte'
import NotFound from '../../views/pages/404.svelte'

export const routes = {
  '/': Home,
  '/404': NotFound,
  '*': NotFound,
}
