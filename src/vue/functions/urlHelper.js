import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useUrlHelper = (() => {
  const baseStore = useBaseStore();
  const patientStore = usePatientStore();

  const getCarePlanDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/delete-track/${carePlanId}`);
  const getCarePlanEditUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/edit-track/${carePlanId}`);

  const getTokenAnswerUrl = ((tokenId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/answer/${tokenId}`);
  const getTokenAskUrl = ((tokenId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/${tokenId}`);
  const getTokenShowUrl = ((tokenId) => `${baseStore.baseUrl}ask/to-survey/${tokenId}`);

  const getTrackCreateUrl = ((trackId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/create/${trackId}`);

  return {
    getCarePlanDeleteUrl,
    getCarePlanEditUrl,
    getTokenAnswerUrl,
    getTokenAskUrl,
    getTokenShowUrl,
    getTrackCreateUrl,
  };
});

export default useUrlHelper;
