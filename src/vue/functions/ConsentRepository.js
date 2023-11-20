import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useConsentRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const consentModel = modelRepository.getModel('Consent');
  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getConsents = (async () => {
    loading.value = true;
    const consents = await consentModel.all({ per_page: 200 });
    loading.value = false;
    if (consents) {
      return consents.sort(sortFieldsFunction(['-start']));
    }
    return null;
  });

  const getResearchConsent = (async () => {
    const consents = await getConsents();
    let researchConsent = null;
    consents.forEach((consent) => {
      if ('category' in consent) {
        consent.category.forEach((category) => {
          if ('coding' in category) {
            category.coding.forEach((codingSystem) => {
              if ('system' in codingSystem
                  && codingSystem.system === 'http://terminology.hl7.org/CodeSystem/consentscope'
                  && 'code' in codingSystem && codingSystem.code === 'research'
              ) {
                researchConsent = consent;
              }
            });
          }
        });
      }
    });
    if (researchConsent !== null) {
      return researchConsent;
    }
    return null;
  });

  return {
    loading,
    getConsents,
    getResearchConsent,
  };
});

export default useConsentRepository;
