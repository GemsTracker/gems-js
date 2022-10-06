import useModelStore from '../stores/modelRepository';
import usePatientStore from '../stores/patientStore';

const useBasePropStorer = ((props) => {
  const modelStore = useModelStore();
  const patientStore = usePatientStore();

  if ('apiUrl' in props) {
    modelStore.setApiUrl(props.apiUrl);
  }
  if ('locale' in props) {
    modelStore.setLocale(props.locale);
  }
  if ('patientNr' in props) {
    patientStore.setPatientNr(props.patientNr);
  }
  if ('organizationId' in props) {
    patientStore.setOrganizationId(props.organizationId);
  }

  return {};
});

export default useBasePropStorer;
