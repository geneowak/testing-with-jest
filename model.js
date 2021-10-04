export default class Model {
  constructor(options = {}) {
    const data = options.data || [];
    delete options.data;
    this.$collection = [];

    this.$options = Object.assign({ primaryKey: 'id' }, options);

    if (data.length) {
      this.record(data);
    }
  }

  record(data) {
    const { primaryKey } = this.$options;
    data.map((entry) => {
      if (entry[primaryKey]) {
        return entry;
      }
      // assign a random id
      entry[primaryKey] = Date.now();
      return entry;
    });
    this.$collection.push(...data);
  }

  all() {
    return this.$collection.map((entry) => Object.assign({}, entry));
  }

  update(key, data) {
    const index = this.$collection.findIndex((entry) => entry[this.$options.primaryKey] === key);

    if (index === -1) {
      return false;
    }

    // this.$collection[index] = Object.assign(this.$collection[index], data);

    // use splice to help Vue track the updates to the array
    this.$collection.splice(index, 1, Object.assign(this.$collection[index], data));
  }

  find(search) {
    const entry = this.$collection.find((entry) => entry[this.$options.primaryKey] === search);
    // we return a copy of the value
    return entry ? Object.assign({}, entry) : null;
  }

  remove(key) {
    const index = this.$collection.findIndex((entry) => entry[this.$options.primaryKey] === key);

    if (index >= 0) {
      this.$collection.splice(index, 1);
    }
  }
}
