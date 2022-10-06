import PatientModelAbstract from './PatientModelAbstract';

export default class Token extends PatientModelAbstract {
  constructor(store) {
    const name = 'tokens';
    super(name, store);
    this.endpoint = 'fhir/questionnaire-task';
    this.idField = 'id';

    this.filters.per_page = 200;
  }
}
