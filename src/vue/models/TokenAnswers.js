import PatientModelAbstract from './PatientModelAbstract';

export default class TokenAnswers extends PatientModelAbstract {
  constructor(store) {
    const name = 'tokenAnswers';
    super(name, store);
    this.endpoint = 'fhir/questionnaire-response';
    this.idField = 'id';

    this.filters.per_page = 200;
  }
}
