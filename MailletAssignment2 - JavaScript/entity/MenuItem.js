// your code here
class MenuItem {
  #id;
  #category;
  #description;
  #price;
  #vegetarian;

  /**
   * @param {number} id
   * @param {string} category
   * @param {string} description
   * @param {number} price
   * @param {boolean} vegetarian
   */
  constructor(id, category, description, price, vegetarian) {
    this.#id = id;
    this.#category = category;
    this.#description = description;
    this.#price = price;
    this.#vegetarian = vegetarian;
  }

  get id() {
    return this.#id;
  }
  get category() {
    return this.#category;
  }
  get description() {
    return this.#description;
  }
  get price() {
    return this.#price;
  }
  get vegetarian() {
    return this.#vegetarian;
  }

  toJSON() {
    return {
      id: this.#id,
      category: this.#category,
      description: this.#description,
      price: this.#price,
      vegetarian: this.#vegetarian,
    };
  }
}
exports.MenuItem = MenuItem;
