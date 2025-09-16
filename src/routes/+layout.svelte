<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<slot />  <!-- Child pages will render here -->

<Footer />
