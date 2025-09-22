<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import FloatingChatWidget from "$lib/components/FloatingChatWidget.svelte";
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

<Navbar />

<slot />  <!-- Child pages will render here -->

<Footer />

<!-- Floating AI Chat Widget -->
<FloatingChatWidget />
