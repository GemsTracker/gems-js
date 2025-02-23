import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useInsertableQuestionnaireRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const insertableQuestionnaireModel = modelRepository.getEndpointModel('InsertableQuestionnaires', 'insertable-questionnaire');
  insertableQuestionnaireModel.idField = null;
  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getInsertableQuestionnairesForOrganization = (async (organizationId) => {
    loading.value = true;
    const filter = {
      organization: organizationId,
      active: 1,
      per_page: 200,
    };
    const questionnaires = await insertableQuestionnaireModel.all(filter);
    // console.log(questionnaires);

    loading.value = false;
    if (questionnaires == null) {
      return [];
    }
    return questionnaires.sort(sortFieldsFunction(['name']));
  });

  const groupByServiceType = ((questionnaires) => {
    const patientQuestionnaires = [];
    const practitionerQuestionnaires = [];

    questionnaires.forEach((questionnaire) => {
      // console.log('SORTING QUESTIONNAIRE', questionnaire);
      if ('subjectType' in questionnaire) {
        if (questionnaire.subjectType.includes('Patient')) {
          // console.log('FOR PATIENTS!');
          patientQuestionnaires.push(questionnaire);
        }
        if (questionnaire.subjectType.includes('Practitioner')) {
          // console.log('FOR PRACTITIONERS!');
          practitionerQuestionnaires.push(questionnaire);
        }
      }
    });

    return [
      patientQuestionnaires,
      practitionerQuestionnaires,
    ];
  });

  return {
    loading,
    getInsertableQuestionnairesForOrganization,
    groupByServiceType,
  };
});

export default useInsertableQuestionnaireRepository;
