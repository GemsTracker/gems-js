import PatientModelAbstract from './PatientModelAbstract';

export default class CarePlan extends PatientModelAbstract {
  constructor() {
    const name = 'carePlan';
    super(name);
    this.endpoint = 'fhir/care-plan';
    this.idField = 'id';
    this.filters.per_page = 10;
  }
}
