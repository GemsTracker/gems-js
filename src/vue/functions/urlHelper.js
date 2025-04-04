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

  const getCarePlanDeleteUrl = ((carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/tracks/delete/${carePlanId}`;
  });
  const getCarePlanUnDeleteUrl = ((carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/tracks/undelete/${carePlanId}`;
  });

  const getCarePlanEditUrl = ((carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/tracks/edit/${carePlanId}`;
  });

  const getCarePlanShowUrl = ((carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/tracks/${carePlanId}`;
  });


  const getChangeConsentUrl = (() => `${baseStore.baseUrl}respondent/change-consent/${patientStore.patientNr}/${patientStore.organizationId}`);

  const getInsertSurveyUrl = ((surveyId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/insert/${surveyId}`);

  const getTokenAnswerUrl = ((tokenId, carePlanId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/track/${carePlanId}/token/answer/${tokenId}`);
  const getTokenAskUrl = ((tokenId) => `${baseStore.baseUrl}ask/to-survey/${tokenId}`);
  const getTokenCorrectUrl = ((tokenId, carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/track/${carePlanId}/token/correct/${tokenId}`;
  });
  const getTokenEditUrl = ((tokenId, carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/track/${carePlanId}/token/edit/${tokenId}`;
  });

  const getTokenShowUrl = ((tokenId, carePlanId, patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}/track/${carePlanId}/token/${tokenId}`;
  });

  const getTrackCreateUrl = ((trackId) => `${baseStore.baseUrl}respondent/${patientStore.patientNr}/${patientStore.organizationId}/tracks/create/${trackId}`);

  const getRespondentShowUrl = ((patientNr = null, organizationId = null) => {
    const { checkedPatientNr, checkedOrganizationId } = checkPatientData(patientNr, organizationId);
    return `${baseStore.baseUrl}respondent/${checkedPatientNr}/${checkedOrganizationId}`;
  });
  const getRespondentEditUrl = (() => `${baseStore.baseUrl}respondent/edit/${patientStore.patientNr}/${patientStore.organizationId}`);

  const getRespondentDeleteUrl = (() => `${baseStore.baseUrl}respondent/delete/${patientStore.patientNr}/${patientStore.organizationId}`);
  const getRespondentUndeleteUrl = (() => `${baseStore.baseUrl}respondent/undelete/${patientStore.patientNr}/${patientStore.organizationId}`);

  return {
    getAppointmentShowUrl,
    getAppointmentEditUrl,
    getCarePlanDeleteUrl,
    getCarePlanEditUrl,
    getCarePlanShowUrl,
    getCarePlanUnDeleteUrl,
    getChangeConsentUrl,
    getTokenCorrectUrl,
    getInsertSurveyUrl,
    getTokenAnswerUrl,
    getTokenAskUrl,
    getTokenEditUrl,
    getTokenShowUrl,
    getTrackCreateUrl,
    getRespondentDeleteUrl,
    getRespondentEditUrl,
    getRespondentShowUrl,
    getRespondentUndeleteUrl,
  };
});

export default useUrlHelper;
