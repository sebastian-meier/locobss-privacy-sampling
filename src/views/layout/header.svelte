<script>
  import Menu from '../components/menu.svelte';

  const menu = [
    { url: '/home',   label: 'Home',   protected: false },
    { url: '/about',  label: 'About',  protected: false }
  ];

</script>

<header>
  <nav>
    <Menu menu={menu} />
  </nav>
</header>