<script setup lang="ts">
import BarChart from "../components/BarChart.vue";
import useFetch from "@/composables/useFetch";
import useApi from "@/composables/useApi";

(async () => {
  const response = await useFetch({
    url: useApi.quotation.url(),
    method: useApi.quotation.method,
  });
  console.log(response);
})();
</script>
<template>
  <div class="quotation">
    <h1>Quotation page</h1>
    <bar-chart />
  </div>
</template>
