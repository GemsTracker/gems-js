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
            let result = returnData.headers.location.replace(this.apiUrl, '').replace(endpoint, '');
            while (result.charAt(0) === '/') {
              result = result.substr(1);
            }
            result = result.split('/');

            return { ...returnData, ...{ newId: result } };
          }
          return returnData;
        });
      return apiCall;
    },

    updateModelData(modelName, { endpoint, data }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      const apiCall = api.update(data)
        .then((returnData) => returnData);
      return apiCall;
    },

    getModelData(modelName, {
      endpoint, groupBy, idField, id, storeOne, filters, loadingHash, /* callback, */
    }) {
      const api = new Api({ apiUrl: this.apiUrl, endpoint, locale: this.locale });
      this.modelData[modelName].loading = true;
      const apiCall = api.load(filters)
        .then((data) => {
          if (data === null) {
            return data;
          }
          let returnData = data;
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
            this.modelData[modelName].data[loadingHash] = returnData;
          }

          return returnData;
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
