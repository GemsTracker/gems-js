import Model from './Model';

export default class EndpointModel extends Model {
  constructor(name, resource, options = {}) {
    super(name);
    this.endpoint = resource;

    Object.keys(options).forEach((optionName) => {
      this[optionName] = options[optionName];
    });

    this.init();

    this.filters.per_page = 10;
  }
}
