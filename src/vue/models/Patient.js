import PatientModelAbstract from './PatientModelAbstract';
import usePatientStore from '../stores/patientStore';

export default class Patient extends PatientModelAbstract {
  constructor(store) {
    const name = 'patient';
    super(name, store);
    this.endpoint = 'fhir/patient';
    this.idField = 'id';
    this.idInUrl = true;
    this.storeOne = true;

    this.patientStore = usePatientStore();

    this.filters.per_page = 200;
  }

  async find(refresh = false) {
    const patientId = this.patientStore.patientNr + this.delimiter
      + this.patientStore.organizationId;
    return this.findById(patientId, refresh);
  }
}
