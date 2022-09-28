<script setup lang="ts">
import { createChart } from "lightweight-charts";
import { ref, onMounted, watch, computed } from "vue";
import useStore from "@/stores/main";
const chartNode: any = ref(null);
const legend: any = ref(null);
const toolTip: any = ref(null);
const legendWrapper: any = ref(null);
const legendText = ref("");
const toolTipClass = ref<string>("is-display-none");

const showTooltip = computed<any>({
  get() {
    return toolTipClass.value;
  },
  set(isShowed: boolean) {
    toolTipClass.value = isShowed ? "" : "is-diplay-none";
  },
});

let label: string;
let chart: any;
let width: number;
let height: number;

const toolTipWidth = ref(200);
const toolTipHeight = ref(80);
const toolTipMargin = ref(15);

onMounted(() => {
  const store = useStore();
  const backTesting = store.backTesting;
  watch(backTesting.data, (value) => {
    label = value[0].label;
    legendText.value = `${label}`;
    setBarChart(value[0].data);
  });
});

function setData(data: any) {
  console.log(data);
  return data.map((d: any) => ({
    time: Date.parse(d.date) / 1000,
    value: d.price,
  }));
}

/* function setTooltipData() {} */

function updateTooltip(param: any) {
  if (toolTip.value === null) return;
  if (
    !param.time ||
    param.point.x < 0 ||
    param.point.x > width ||
    param.point.y < 0 ||
    param.point.y > height
  ) {
    showTooltip.value = false;
    return;
  }
  showTooltip.value = true;

  const y = param.point.y;

  let left = param.point.x + toolTipMargin.value;
  if (left > width - toolTipWidth.value) {
    left = param.point.x - toolTipMargin.value - toolTipWidth.value;
  }

  let top = y + toolTipMargin.value;
  if (top > height - toolTipHeight.value) {
    top = y - toolTipHeight.value - toolTipMargin.value;
  }

  toolTip.value.style.left = left + "px";
  toolTip.value.style.top = top + "px";
}

function setBarChart(data: any) {
  if (chartNode.value instanceof HTMLElement && !chart) {
    const offsetWidth = chartNode.value.offsetWidth;
    const offsetHeight = 400;
    (width = offsetWidth), (height = offsetHeight);
    const chart = createChart(chartNode.value, {
      width: offsetWidth,
      height: offsetHeight,
      timeScale: {
        timeVisible: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: {
          width: 4,
          color: "rgba(224, 227, 235, 0.1)",
          style: 0,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
      localization: {
        priceFormatter: (p: any) => `${p.toFixed(2).padEnd(10)}`,
      },
      layout: {
        fontFamily: "monospace",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0)",
        },
      },
    });

    const areaSeries = chart.addAreaSeries({
      topColor: "rgba(38, 198, 218, 0.56)",
      bottomColor: "rgba(38, 198, 218, 0.04)",
      lineColor: "rgba(38, 198, 218, 1)",
      lineWidth: 2,
      crosshairMarkerVisible: true,
    });

    areaSeries.setData(setData(data));

    chart.subscribeCrosshairMove((param: any) => {
      if (param.time) {
        const price = param.seriesPrices.get(areaSeries);
        let formatedPrice: number | string = Number(price || 0);
        formatedPrice = formatedPrice.toFixed(2);
        legendText.value = `${label}: ${formatedPrice}$`;
        updateTooltip(param);
      } else {
        legendText.value = `${label}`;
      }
    });

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
    <div ref="chartNode" class="chartNode">
      <div ref="legendWrapper" class="legendWrapper">
        <div ref="legend" class="legend">{{ legendText }}</div>
      </div>
      <div ref="toolTip" class="floating-tooltip" :class="toolTipClass">
        <b>
          <p>{{ legendText }}</p>
        </b>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.legendWrapper {
  position: absolute;
  z-index: 10;
  top: 2rem;
  left: 2rem;
}
.legend {
  color: black;
}
.chartNode {
  position: relative;
}

.is-display-none {
  display: none;
}
.floating-tooltip {
  width: calc(v-bind(toolTipWidth) * 1px);
  height: calc(v-bind(toolTipHeight) * 1px);
  position: absolute;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
  color: #131722;
  background-color: rgba(255, 255, 255, 1);
  text-align: left;
  z-index: 1000;
  top: 12px;
  left: 12px;
  pointer-events: none;
  border: 1px solid rgba(255, 70, 70, 1);
  border-radius: 2px;
}
</style>
