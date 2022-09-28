import { availableStrategies as Store } from "../stores/mainStore";

export class DynamicClass {
  constructor(className: string, ...opts: any) {
    if (Store[className] === undefined || Store[className] === null) {
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new Store[className]({ ...opts });
  }
}
