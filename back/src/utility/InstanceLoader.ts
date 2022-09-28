/**
 * Creates a dynamic instance of a specific class/prototype.
 * Minor changes from initial solution shared by **Steve Fenton**
 *
 * WARNING: This solution don't works on Angular applications,
 * using JIT (because the webpack don't compiles classes into window object)
 * or AOT (js minification for production build) compilation.
 *
 * @see https://www.stevefenton.co.uk/2014/07/creating-typescript-classes-dynamically/
 */
export class InstanceLoader {
  static getInstance<T>(
    context: { [key: string]: any },
    name: string,
    ...args: any[]
  ): T {
    const classRef: { new (...args: any[]): any } = context[name];

    if (!classRef) {
      throw new Error(`The class '${name}' was not found`);
    }

    let instance = Object.create(classRef.prototype);

    try {
      instance.constructor.apply(instance, args);
    } catch (err: any) {
      /**
       * For ES2015(ES6): constructor.apply is not allowed
       */
      if (/Class constructor/.test(err.toString())) {
        instance = class extends classRef {
          constructor(...params: any[]) {
            super(...params);
          }
        };

        return <T>new instance(args);
      }
    }

    return <T>instance;
  }
}
