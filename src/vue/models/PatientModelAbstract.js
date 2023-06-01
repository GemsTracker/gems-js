import Model from './Model';
import usePatientStore from '../stores/patientStore';

export default class PatientModelAbstract extends Model {
  constructor(name, store) {
    console.log(name);
    super(name, store);

    this.respondentData = true;
    this.patientField = 'patient';
    this.patientStore = usePatientStore();

    this.delimiter = this.patientStore.delimiter;

    this.addRespondentDataToFilters();
  }

  async all(filters = null, refresh = false) {
    this.addRespondentDataToFilters();
    return super.all(filters, refresh);
  }

  async findById(id, filters = null, refresh = false) {
    this.addRespondentDataToFilters();
    return super.findById(id, filters, refresh);
  }

  addRespondentDataToFilters() {
    this.withPatientNrOrganizationCombination();
  }

  withPatientNrOrganizationCombination() {
    this.filters[this.patientField] = this.patientStore.patientOrganizationCombination;
  }
}
