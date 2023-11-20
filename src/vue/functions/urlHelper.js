import useBaseStore from '../stores/baseStore';
import usePatientStore from '../stores/patientStore';

const useUrlHelper = (() => {
  const baseStore = useBaseStore();
  const patientStore = usePatientStore();

  const checkPatientData = ((patientNr, organizationId) => {
    let checkedPatientNr = patientNr;
    if (checkedPatientNr === null) {
      checkedPatientNr = patientStore.patientNr;
    }
    let checkedOrganizationId = organizationId;
    if (checkedOrganizationId === null) {
      checkedOrganizationId = patientStore.organizationId;
    }

    return {
      checkedPatientNr,
      checkedOrganizationId,
    };
  });

  const getAppointmentShowUrl = ((appointmentId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/appointments/${appointmentId}`;
  });
  const getAppointmentEditUrl = ((appointmentId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/appointments/edit/${appointmentId}`;
  });

  const getCarePlanDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/delete/${carePlanId}`);
  const getCarePlanUnDeleteUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/undelete/${carePlanId}`);
  const getCarePlanEditUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/edit/${carePlanId}`);
  const getCarePlanShowUrl = ((carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/${carePlanId}`);

  const getInsertSurveyUrl = ((surveyId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/insert/${surveyId}`);

  const getTokenAnswerUrl = ((tokenId, carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/track/${carePlanId}/token/answer/${tokenId}`);
  const getTokenAskUrl = ((tokenId) => `${baseStore.baseUrl}ask/to-survey/${tokenId}`);
  const getTokenShowUrl = ((tokenId, carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/track/${carePlanId}/token/${tokenId}`;
  });

  const getTrackCreateUrl = ((trackId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/create/${trackId}`);

  const getRespondentShowUrl = ((patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}`;
  });
  const getRespondentDeleteUrl = (() => `${baseStore.baseUrl}respondent/delete/${patientStore.patientNr}/${patientStore.organizationId}`);
  const getRespondentUndeleteUrl = (() => `${baseStore.baseUrl}respondent/undelete/${patientStore.patientNr}/${patientStore.organizationId}`);

  return {
    getAppointmentShowUrl,
    getAppointmentEditUrl,
    getCarePlanDeleteUrl,
    getCarePlanEditUrl,
    getCarePlanShowUrl,
    getCarePlanUnDeleteUrl,
    getInsertSurveyUrl,
    getTokenAnswerUrl,
    getTokenAskUrl,
    getTokenShowUrl,
    getTrackCreateUrl,
    getRespondentDeleteUrl,
    getRespondentShowUrl,
    getRespondentUndeleteUrl,
  };
});

export default useUrlHelper;
