import axios from 'axios';

// import pickBy from 'lodash/pickBy';

export default class Api {
  constructor({ apiUrl, endpoint, locale }) {
    this.url = apiUrl;
    this.endpoint = endpoint;

    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-gems-vue': 1,
    };
    if (locale !== null && locale !== undefined) {
      headers['Accept-Language'] = locale;
    }

    if ('devToken' in window) {
      headers.Authorization = `Bearer ${window.devToken}`;
    }

    this.client = axios.create({
      baseURL: this.url,
      headers,
    });

    this.emptyResponse = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    };

    this.mockEndpoints = [
      // 'tokens',
    ];

    this.latency = 1000;
  }

  delete(data) {
    // console.log('DELETING: ' + this.endpoint);
    // console.log(data);

    return this.client.delete(`/${this.endpoint}`, { data })
      .then((response) => response.data).catch((error) => {
        console.log(error);
        console.log(error.response.data);
      });
  }

  insert(data) {
    console.log(`INSERTING: ${this.endpoint}`, data);
    const { endpoint } = this;
    return this.client.post(`/${this.endpoint}`, data)
      .then((response) => response)
      .catch((error) => {
        console.log(error);
        console.log(error.response.data);
        return error.response;
      });
  }

  load(filters) {
    // console.log('LOADING: '+this.endpoint);

    const endpoint = this.endpoint.split('/');

    // console.log(this.mockEndpoints);
    // console.log(endpoint);
    // console.log(this.mockEndpoints.indexOf(endpoint[0]));

    if (this.mockEndpoints.indexOf(endpoint[0]) === -1) {
      console.log(`API CALL: ${this.url}/${this.endpoint}?${this.constructor.getTextFilters(filters)}`);
      return this.client.get(`/${this.endpoint}`, {
        params: filters,
      }).then((response) => {
        if (response.status === 204) {
          return null;
        }
        console.log(response.data);
        return response;
      }).catch((e) => {
        console.log(e.response);
        console.log(e);
        return null;
      });
    }
    // console.log('MOCK CALL for ' + this.endpoint);
    return new Promise((resolve/* , reject */) => {
      const response = this.getResponse(filters);
      setTimeout(() => {
        resolve(response);
      }, this.latency);
    }).then((response) => response.data).catch((e) => {
      console.log(e);
    });
  }

  structure() {
    console.log(`${this.url}/${this.endpoint}/structure`);
    return this.client.get(`/${this.endpoint}/structure`)
      .then((response) => response.data).catch((e) => {
        console.log(e);
      });
  }

  update(data, filters = null) {
    console.log(`UPDATING: ${this.url}/${this.endpoint}?${this.constructor.getTextFilters(filters)}`, data);
    console.log(filters);
    return this.client.patch(`/${this.endpoint}`, data, {
      params: filters,
    })
        .then((response) => response).catch((error) => {
          console.log(error);
          console.log(error.response.data);
          return error.response;
        });
  }

  getResponse(/* filters */) {
    const response = this.emptyResponse;

    // const endpoint = this.endpoint.split('/');

    /* if (endpoint[0] == 'tokens') {
            response.data = this.filter(tokens, filters);
            return response;
        } */

    return response;
  }

  static getTextFilters(filters) {
    let textFilter = '';
    if (filters === null) {
      return textFilter;
    }
    Object.keys(filters).forEach((field) => {
      let value = filters[field];
      if (Array.isArray(value)) {
        value = `[${value.join(',')}]`;
      }
      textFilter += `${field}=${value}&`;
    });
    return textFilter;
  }

  /* static filter(data, filters) {
    return pickBy(data, (value) => {
      let filteredData = true;
      Object.keys(filters).forEach((i) => {
        if (value[i] !== filters[i]) {
          filteredData = false;
        }
      });
      return filteredData;
    });
  } */

  /*
     * Example api call
    loadTracks()
    {
        return axios.get(this.url+'/tracks', {
            params: {
                active: 1
            }
        }).then(response => {
                return response.data;
            }).catch(e => {
                console.log(e);
            });
    } */
}
