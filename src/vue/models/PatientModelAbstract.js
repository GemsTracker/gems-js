import Model from './Model';
import usePatientStore from '../stores/patientStore';

export default class PatientModelAbstract extends Model {
  constructor(name, store) {
    console.log(name);
    super(name, store);

    this.respondentData = true;
    this.patientField = 'patient';
    this.delimiter = '@';

    this.patientStore = usePatientStore();

    this.addRespondentDataToFilters();
  }

  addRespondentDataToFilters() {
    this.withPatientNrOrganizationCombination();
  }

  withPatientNrOrganizationCombination() {
    this.filters[this.patientField] = this.patientStore.patientNr
      + this.delimiter + this.patientStore.organizationId;
  }
}
