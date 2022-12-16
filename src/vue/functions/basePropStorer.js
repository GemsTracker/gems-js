import useModelStore from '../stores/modelRepository';
import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useBasePropStorer = ((props) => {
  const baseStore = useBaseStore();
  const modelStore = useModelStore();
  const patientStore = usePatientStore();

  if ('apiUrl' in props) {
    modelStore.setApiUrl(props.apiUrl);
  }
  if ('baseUrl' in props) {
    baseStore.setBaseUrl(props.baseUrl);
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
