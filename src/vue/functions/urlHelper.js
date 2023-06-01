import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useUrlHelper = (() => {
  const baseStore = useBaseStore();
  const patientStore = usePatientStore();

  const getCarePlanDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/delete-track/${carePlanId}`);
  const getCarePlanEditUrl = ((carePlanId) => {
    console.log(baseStore.baseUrl);
    console.log(`${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/edit-track/${carePlanId}`);
    return `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/edit-track/${carePlanId}`;
  });

  const getInsertSurveyUrl = ((surveyId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/insert/${surveyId}`);

  const getTokenAnswerUrl = ((tokenId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/answer/${tokenId}`);
  const getTokenAskUrl = ((tokenId) => `${baseStore.baseUrl}ask/to-survey/${tokenId}`);
  const getTokenShowUrl = ((tokenId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/${tokenId}`);

  const getTrackCreateUrl = ((trackId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/create/${trackId}`);

  const getRespondentDeleteUrl = ((trackId) => `${baseStore.baseUrl}respondent/delete/${patientStore.patientNr}/${patientStore.organizationId}`);
  const getRespondentUndeleteUrl = ((trackId) => `${baseStore.baseUrl}respondent/undelete/${patientStore.patientNr}/${patientStore.organizationId}`);

  return {
    getCarePlanDeleteUrl,
    getCarePlanEditUrl,
    getInsertSurveyUrl,
    getTokenAnswerUrl,
    getTokenAskUrl,
    getTokenShowUrl,
    getTrackCreateUrl,
    getRespondentDeleteUrl,
    getRespondentUndeleteUrl,
  };
});

export default useUrlHelper;
