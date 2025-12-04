import useStore from '../stores/modelRepository';

export default class Model {
  constructor(name) {
    this.store = useStore();
    this.idField = null;
    this.idInUrl = true;
    this.filters = {};
    this.groupBy = null;
    this.loadingAll = {};
    this.loadingIds = {};
    this.storeOne = false;
    this.idInUrl = true;
    this.storeAllAsId = false;
    this.structureData = null;
    this.updating = false;
    this.inserting = false;

    this.name = name;

    this.initialState = {
      loading: false,
      data: {},
      structure: null,
      headers: {},
    };

    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  afterLoad() { }

  addFilters(filters) {
    this.filters = { ...this.filters, ...filters };
  }

  async all(filters = null, refresh = false) {
    const currentFilters = { ...this.filters, ...filters };

    let page = 1;
    if ('page' in currentFilters) {
      page = currentFilters.page;
      delete currentFilters.page;
    }
    let perPage = null;
    if ('per_page' in currentFilters) {
      perPage = currentFilters.per_page;
      delete currentFilters.per_page;
    }

    const loadingHash = this.constructor.getLoadingHash(currentFilters);
    if (refresh === true
      || ((Object.keys(this.state.data).length === 0 || (!(loadingHash in this.state.data)))
        && this.loadingAll[loadingHash] === undefined)) {
      const loadData = this.getLoadData();
      loadData.loadingHash = loadingHash;
      loadData.filters = this.constructor.checkFilters(currentFilters);
      loadData.page = page;
      loadData.perPage = perPage;

      this.loadingAll[loadingHash] = this.store.getModelData(this.name, loadData);
      const returnData = await this.loadingAll[loadingHash];
      this.afterLoad();

      delete this.loadingAll[loadingHash];

      return returnData.data;
    }

    if (this.loadingAll[loadingHash] !== undefined) {
      const returnValues = await this.loadingAll[loadingHash];
      return returnValues.data;
    }

    if (loadingHash in this.state.data) {
      return this.state.data[loadingHash].data;
    }

    return null;
  }

  async getPageData(filters, page, perPage, refresh = false) {
    filters['page'] = page;
    filters['per_page'] = perPage;

    const currentFilters = { ...filters, ...this.filters };

    const loadingHash = this.constructor.getLoadingHash(currentFilters);
    if (refresh === true
        || ((Object.keys(this.state.data).length === 0 || (!(loadingHash in this.state.data)))
            && this.loadingAll[loadingHash] === undefined)) {
      const loadData = this.getLoadData();
      loadData.loadingHash = loadingHash;
      loadData.filters = this.constructor.checkFilters(currentFilters);
      loadData.page = page;
      loadData.perPage = perPage;

      this.loadingAll[loadingHash] = this.store.getModelData(this.name, loadData);
      const returnData = await this.loadingAll[loadingHash];
      this.afterLoad();

      delete this.loadingAll[loadingHash];

      return returnData;
    }

    if (this.loadingAll[loadingHash] !== undefined) {
      const returnValues = await this.loadingAll[loadingHash];
      return returnValues;
    }

    if (loadingHash in this.state.data) {
      return this.state.data[loadingHash];
    }

    return null;
  }

  static checkFilters(filters) {
    const checkedFilters = {};
    Object.keys(filters).forEach((fieldName) => {
      let value = filters[fieldName];
      if (Array.isArray(value)) {
        value = `[${value.join(',')}]`;
      }
      checkedFilters[fieldName] = value;
    });
    return checkedFilters;
  }

  async findById(id, filters = null, refresh = false) {
    if ((typeof id === 'number' || typeof id === 'string')) {
      // console.log(`Find by ID call to ${this.endpoint}...${id}`);
      if (refresh === true
        || ((this.state === null || !('data' in this.state) || Object.keys(this.state.data).length === 0
          || (this.state.data[id] === undefined && this.storeOne === false))
          && this.loadingIds[id] === undefined
        )) {
        const loadData = this.getLoadData();
        loadData.filters = this.constructor.checkFilters({ ...this.filters, ...filters });
        if (this.idField) {
          loadData.filters[this.idField] = id;
        }
        if (this.idInUrl) {
          loadData.endpoint += `/${id}`;
        }
        loadData.id = id;

        this.loadingIds[id] = this.store.getModelData(this.name, loadData);
        const { data } = await this.loadingIds[id];

        // delete this.loadingIds[id];
        if (data === null) {
          return data;
        }
        if (!this.storeOne) {
          if (!this.storeAllAsId) {
            return data[id];
          }
        }
        return data;
      }

      if (this.loadingIds[id] !== undefined) {
        const { data } = await this.loadingIds[id];
        if (!this.storeOne) {
          if (!this.storeAllAsId) {
            return data[id];
          }
        }
        return data;
      }

      if (!this.storeOne) {
        return this.state.data[id];
      }
      return this.state.data;
    }
    return null;
  }

  getLoadData() {
    const data = {
      endpoint: this.endpoint,
      groupBy: this.groupBy,
      idField: this.idField,
      storeOne: this.storeOne,
      id: null,
      loadingHash: null,
    };
    console.log(data);
    return data;
  }

  static getLoadingHash(filters) {
    const keys = Object.keys(filters);
    keys.sort();
    const sortedFilter = {};
    keys.forEach((filterKey) => {
      sortedFilter[filterKey] = filters[filterKey];
    });
    console.log('LOADING HASH FILTER', sortedFilter);
    return Model.hashString(JSON.stringify(sortedFilter));
  }

  static hashString(string, seed = 0) {
    // eslint-disable-next-line no-bitwise
    let h1 = 0xdeadbeef ^ seed;
    // eslint-disable-next-line no-bitwise
    let h2 = 0x41c6ce57 ^ seed;
    // eslint-disable-next-line no-plusplus
    for (let i = 0, ch; i < string.length; i++) {
      ch = string.charCodeAt(i);
      // eslint-disable-next-line no-bitwise
      h1 = Math.imul(h1 ^ ch, 2654435761);
      // eslint-disable-next-line no-bitwise
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    // eslint-disable-next-line no-bitwise
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    // eslint-disable-next-line no-bitwise
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    // eslint-disable-next-line no-bitwise
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  async structure() {
    if (this.state.structure === null) {
      const structurePromise = this.store.getModelStructure(this.name, this.endpoint);

      await structurePromise;
    }
    return this.state.structure;
  }

  clear() {
    this.store.clearModelData(this.name, this.initialState);
  }

  async deleteById(id, data) {
    const deleteData = {
      endpoint: `${this.endpoint}/${id}`,
      data,
    };
    this.updating = this.store.deleteModelData(this.name, deleteData);

    return this.updating;
  }

  async insert(data) {
    const insertData = {
      endpoint: this.endpoint,
      data,
    };
    this.inserting = this.store.insertModelData(this.name, insertData);

    return this.inserting;
  }

  static isEmptyObject(obj) {
    return obj !== null && obj !== undefined && Object.keys(obj).length === 0
      && obj.constructor === Object;
  }

  async updateById(id, data, filters = null) {
    const updateData = {
      endpoint: `${this.endpoint}/${id}`,
      data,
      filters,
    };
    this.updating = this.store.updateModelData(this.name, updateData);

    return this.updating;
  }

  init() {
    this.store.initModelData(this.name, this.initialState);
  }

  get state() {
    if (this.name in this.store.modelData) {
      return this.store.modelData[this.name];
    }
    return null;
  }

  get validationErrors() {
    return this.state.validationErrors;
  }
}
