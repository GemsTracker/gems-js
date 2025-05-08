import { useI18n } from 'vue-i18n';
import useModelStore from '../stores/modelRepository';
import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useBasePropStorer = ((props) => {
  const baseStore = useBaseStore();
  const modelStore = useModelStore();
  const patientStore = usePatientStore();

  const baseTags = document.getElementsByTagName('base');
  if (baseTags.length) {
    const baseUrl = baseTags[0].getAttribute('href');
    baseStore.setBaseUrl(baseUrl);
  } else if ('baseUrl' in props) {
    baseStore.setBaseUrl(props.baseUrl);
  }
  
  baseStore.setBaseProps(props);

  if ('apiUrl' in props) {
    modelStore.setApiUrl(props.apiUrl);
  }
  if ('locale' in props) {
    modelStore.setLocale(props.locale);
    const { locale } = useI18n({ useScope: 'global' });
    locale.value = props.locale;
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
