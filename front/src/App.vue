<script setup lang="ts">
import AlpacaGate from "./composables/AlpacaGate";
const gate = new AlpacaGate("http://localhost:8000");
if (location.pathname === "/") location.href += "quotation";
</script>
<template>
  <nav>
    <router-link to="/backtesting">BackTesting</router-link> |
    <router-link to="/quotation">Quotation</router-link>
  </nav>
  <button class="btn btn-primary m-2" @click="gate.reload">Reload</button>
  <button class="btn btn-primary m-2" @click="gate.disconnect">
    Disconnect
  </button>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 2rem;
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
