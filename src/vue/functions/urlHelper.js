import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useUrlHelper = (() => {
  const baseStore = useBaseStore();
  const patientStore = usePatientStore();

  const getCarePlanDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/delete/${carePlanId}`);
  const getCarePlanUnDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/undelete/${carePlanId}`);
  const getCarePlanEditUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/edit/${carePlanId}`);

  const getInsertSurveyUrl = ((surveyId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/insert/${surveyId}`);

  const getTokenAnswerUrl = ((tokenId, carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/track/${carePlanId}/token/answer/${tokenId}`);
  const getTokenAskUrl = ((tokenId) => `${baseStore.baseUrl}ask/to-survey/${tokenId}`);
  const getTokenShowUrl = ((tokenId, carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/track/${carePlanId}/token/${tokenId}`);

  const getTrackCreateUrl = ((trackId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/create/${trackId}`);

  const getRespondentDeleteUrl = (() => `${baseStore.baseUrl}respondent/delete/${patientStore.patientNr}/${patientStore.organizationId}`);
  const getRespondentUndeleteUrl = (() => `${baseStore.baseUrl}respondent/undelete/${patientStore.patientNr}/${patientStore.organizationId}`);

  return {
    getCarePlanDeleteUrl,

    getCarePlanEditUrl,
    getCarePlanUnDeleteUrl,
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
