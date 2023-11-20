import PatientModelAbstract from './PatientModelAbstract';

export default class Consent extends PatientModelAbstract {
  constructor() {
    const name = 'consent';
    super(name);
    this.endpoint = 'fhir/consent';
    this.filters.per_page = 200;
  }
}
