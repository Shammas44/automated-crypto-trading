import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
const useStore = defineStore({
  id: "main",
  state: () => ({
    backTesting: {
      data: [] as any,
    },
    currentAsset: {
      quotes: [] as any,
      bars: [] as any,
      trades: [] as any,
      historicalBars: [] as any,
    },
  }),
  actions: {},
});

export default useStore;
