<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from "vue";
import { createChart, CrosshairMode } from "lightweight-charts";
import useStore from "@/stores/main";
import { CandlestickData } from "lightweight-charts";
const chartNode: any = ref(null);
const arrayMaxSize = 10;
const quotes = ref([...Array(arrayMaxSize)]);
let data: CandlestickData[] = [];
/* let socket: Socket; */
let currentBar = {} as CandlestickData;
let trades: any = [];
let chart: any;
let candleSeries: any;
let chartIsReady = false;

// Utility
// ==========================================================================

const add = (array: any[], value: any) => [
  value,
  ...array.slice(0, array.length - 1),
];

function setData(bars: any[]) {
  console.log(bars);
  data = bars.map(
    (bar: any) =>
      ({
        time: Date.parse(bar.Timestamp) / 1000,
        open: bar.Open,
        high: bar.High,
        low: bar.Low,
        close: bar.Close,
      } as CandlestickData)
  );
  currentBar = data[data.length - 1];
}

// Handler
// ==========================================================================

function quoteHandler(quote: any) {
  quotes.value = add(quotes.value, quote);
}

function tradeHandler(trade: any) {
  if (chartIsReady) {
    trades.push(trade.Price);
    candleSeries.update({
      time: Number(currentBar.time) + 60,
      open: trades[0],
      high: Math.max(...trades),
      low: Math.min(...trades),
      close: trades[trades.length - 1],
    } as CandlestickData);
  }
}

function barHandler(bar: any) {
  trades = [];
  const newBar = {
    time: Date.parse(bar.Timestamp) / 1000,
    open: bar.Open,
    high: bar.High,
    low: bar.Low,
    close: bar.Close,
  } as CandlestickData;
  candleSeries.update(newBar);
  currentBar = newBar;
}

function historycalBarsHandler(bars: any) {
  setData(bars);
  setBarChart();
  chartIsReady = true;
}

onMounted(() => {
  // TODO: an array is not a suitable container for storing trading data
  const store = useStore();
  const currentAsset = store.currentAsset;
  watch(currentAsset.bars, (value) => {
    barHandler(value[value.length - 1]);
  });
  watch(currentAsset.trades, (value) => {
    tradeHandler(value[value.length - 1]);
  });
  watch(currentAsset.quotes, (value) => {
    quoteHandler(value[value.length - 1]);
  });
  watch(currentAsset.historicalBars, (value) => {
    historycalBarsHandler(toRaw(value[0]));
  });
});

function setBarChart() {
  if (chartNode.value instanceof HTMLElement && !chart) {
    const offsetWidth = chartNode.value.offsetWidth;
    const height = 400;
    chart = createChart(chartNode.value, {
      width: offsetWidth,
      height: height,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      localization: {
        priceFormatter: (p: any) => `${p.toFixed(2).padEnd(10)}`,
      },
      layout: {
        fontFamily: "monospace",
      },

      timeScale: {
        timeVisible: true,
      },
    });

    candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(data);

    //resize chart when window size changes
    window.addEventListener("resize", () => {
      const offsetWidth = chartNode.value.offsetWidth;
      chart.resize(offsetWidth, height);
    });
  }
}
</script>
<template>
  <div>
    <div ref="chartNode" class="chartNode"></div>
  </div>
</template>
<style scoped></style>
