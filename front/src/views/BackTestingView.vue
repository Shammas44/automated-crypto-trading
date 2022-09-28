<script setup lang="ts">
import useFetch from "@/composables/useFetch";
import RegularChart from "@/components/RegularChart.vue";
import useApi from "@/composables/useApi";

(async () => {
  const response = await useFetch({
    url: useApi.backtesting.url(),
    method: useApi.backtesting.method,
  });
})();
</script>
<template>
  <div class="backtesting">
    <h1>BackTesting Page</h1>
    <regular-chart />
  </div>
</template>
