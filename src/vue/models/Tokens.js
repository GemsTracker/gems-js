import PatientModelAbstract from './PatientModelAbstract';

export default class Token extends PatientModelAbstract {
  constructor(store) {
    const name = 'tokens';
    super(name, store);
    this.endpoint = 'fhir/questionnaire-task';
    this.idField = 'id';

    this.filters.per_page = 200;
  }

  async findById(id, filters = null, refresh = false) {
    this.addRespondentData = false;
    const result = super.findById(id, filters, refresh);
    this.addRespondentData = true;
    return result;
  }
}
