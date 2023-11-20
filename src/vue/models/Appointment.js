import PatientModelAbstract from './PatientModelAbstract';

export default class Appointment extends PatientModelAbstract {
  constructor() {
    const name = 'appointment';
    super(name);
    this.endpoint = 'fhir/appointment';
    this.filters.per_page = 200;
  }
}
