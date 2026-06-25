<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: #0a0a0a; }
#app { display: flex; flex-direction: column; min-height: 100vh; }
.main-content { flex: 1; }
</style>