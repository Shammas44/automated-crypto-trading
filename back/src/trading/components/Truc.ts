class Truc {
  /**
   * @description Some private member which WONT be in jsdoc (because it is private)
   * @private
   * @type {string}
   */
  private name: string;

  /**
   * @description Some protected member which will go to the docs
   * @protected
   * @type {number}
   */
  protected somethingIsA: number;

  /**
   * @description And static member which will goes to the docs.
   * @type {number}
   * @memberof Truc
   */
  static someStaticMember: number;

  public notCommentedWontBeInJSDoc: string;

  /**
   * Creates an instance of Truc.
   * @param {string} color
   */
  constructor(color: string) {
    this.name = "salut";
    this.somethingIsA = 1;
    Truc.someStaticMember = 1;
    this.notCommentedWontBeInJSDoc = "yo";
    console.log(this.name);
  }
}
