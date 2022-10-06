import CarePlan from './CarePlan';
import EndpointModel from './EndpointModel';
import Patient from './Patient';
import Tokens from './Tokens';
import TokenAnswers from './TokenAnswers';
import useStore from '../stores/modelRepository';

export default class ModelRepository {
  constructor() {
    this.registeredModels = {
      CarePlan,
      Patient,
      Tokens,
      TokenAnswers,
    };

    this.store = useStore();
  }

  createModelFromEndpoint(modelName, endpoint, options = {}) {
    const model = new EndpointModel(modelName, endpoint, options);
    this.store.addModel(modelName, model);
    return this.store.models[modelName];
  }

  getEndpointModel(modelName, endpoint, options = {}) {
    if (modelName in this.store.models) {
      return this.store.models[modelName];
    }

    return this.createModelFromEndpoint(modelName, endpoint, options);
  }

  getModel(modelName) {
    if (modelName in this.store.models) {
      console.log(`Direct return of ${modelName}`);
      return this.store.models[modelName];
    }

    if (modelName in this.registeredModels) {
      const ModelFile = this.registeredModels[modelName];
      this.store.addModel(modelName, new ModelFile(this.store));
      return this.store.models[modelName];
    }

    return null;
  }
}
