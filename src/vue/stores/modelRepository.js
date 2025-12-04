import { defineStore } from 'pinia';

import Api from '../api';

const groupDataBy = (groupBy, idField, data) => {
  const groupedData = {};
  Object.keys(data).forEach((key) => {
    const groupKey = data[key][groupBy];
    if (groupedData[groupKey] === undefined) {
      groupedData[groupKey] = [];
      if (idField) {
        groupedData[groupKey] = {};
      }
    }

    if (idField) {
      const idKey = data[key][idField];
      groupedData[groupKey][idKey] = data[key];
    } else {
      groupedData[groupKey].push(data[key]);
    }
  });
  return groupedData;
};

const addIdFieldAsKey = (data, idField) => {
  const filteredData = {};
  if (Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      const newKey = data[key][idField];
      filteredData[newKey] = data[key];
    });
  } else {
    const newKey = data[idField];
    filteredData[newKey] = data;
  }

  return filteredData;
};

const addIdAsKey = (data, id) => {
  const filteredData = {};
  filteredData[id] = data;

  return filteredData;
};

export default defineStore('modelRepository', {
  state: () => ({
    apiUrl: null,
    locale: null,
    modelRepository: null,
    models: {},
    modelData: {},
  }),
  actions: {
    setModelRepository(modelRepository) {
      this.modelRepository = modelRepository;
    },
    addModel(modelName, model) {
      this.models[modelName] = model;
    },
    clearModelData(modelName, initialData = {}) {
      this.modelData[modelName] = initialData;
    },
    initModelData(modelName, initialData) {
      if (!(modelName in this.modelData)) {
        this.modelData[modelName] = initialData;
      }
    },

    setApiUrl(apiUrl) {
      this.apiUrl = apiUrl;
    },

    setLocale(locale) {
      this.locale = locale;
    },

    deleteModelData(modelName, { endpoint, data }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      const apiCall = api.delete(data)
        .then((responseData) => responseData);
      return apiCall;
    },

    insertModelData(modelName, { endpoint, data }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      const apiCall = api.insert(data)
        .then((returnData) => {
          if ('location' in returnData.headers) {
            const result = returnData.headers.location
                .replace(this.apiUrl, '')
                .replace(endpoint, '')
                .split('/') // Split by '/'
                .filter(entry => entry !== ''); // Remove empty entries

            return { ...returnData, ...{ newId: result } };
          }
          return returnData;
        });
      return apiCall;
    },

    updateModelData(modelName, { endpoint, data, filters }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      const apiCall = api.update(data, filters)
        .then((returnData) => returnData);
      return apiCall;
    },

    getModelData(modelName, {
      endpoint, groupBy, idField, id, storeOne, filters, loadingHash, perPage, page/* callback, */
    }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      this.modelData[modelName].loading = true;
      const fullFilters = { ...filters };
      if (perPage) {
        fullFilters['per_page'] = perPage;
      }
      if (page) {
        fullFilters['page'] = page;
      }
      const apiCall = api.load(fullFilters)
        .then((response) => {
          if (response === null) {
            return {
              data: null,
              totalCount: null
            };
          }
          const { data, headers } = response;

          if (data === null ) {
            return {
              data: null,
              totalCount: null
            };
          }
          let returnData = data;
          if (perPage == null) {
            perPage = returnData.length;
          }

          if (groupBy) {
            returnData = groupDataBy(groupBy, idField, returnData);
          } else if (idField) {
            returnData = addIdFieldAsKey(returnData, idField);
          } else if (id) {
            returnData = addIdAsKey(returnData, id);
          }

          if (storeOne === true && returnData !== null) {
            [returnData] = Object.values(returnData);
          }

          if (loadingHash !== null) {
            let paginatedHash = `${loadingHash}_${perPage}_${page}`;

            this.modelData[modelName].data[paginatedHash] = returnData;
            this.modelData[modelName].headers[loadingHash] = headers;
          }

          const returnInfo = {
            data: returnData,
            totalCount: null,
          };

          if ('x-total-count' in headers) {
            returnInfo.totalCount = Number(headers['x-total-count']);
          }
          return returnInfo;
        });

      return apiCall;
    },
    getModelStructure(modelName, endpoint) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      const apiCall = api.structure()
        .then((data) => {
          console.log(`Received STRUCTURE DATA for ${endpoint}`);
          console.log(data);
          this.modelData[modelName].structure = data;
          return data;
        });
      return apiCall;
    },

    addValidationErrors(modelName, { index, errors }) {
      let { validationErrors } = this.modelData[modelName];
      if (index == null) {
        validationErrors = errors;
      } else {
        if (typeof validationErrors !== 'object' || validationErrors === null) {
          validationErrors = {};
        }
        validationErrors[index] = errors;
      }

      this.modelData[modelName].validationErrors = validationErrors;
    },

    removeValidationErrors(modelName, { index }) {
      let { validationErrors } = this.modelData[modelName];
      if (index === null) {
        validationErrors = null;
      } else if (validationErrors !== null && typeof validationErrors === 'object' && index in validationErrors) {
        delete validationErrors[index];
      }
      this.modelData[modelName].validationErrors = validationErrors;
    },
  },
});
