import { ref } from 'vue';
import useGetModelRepository from './modelRepository';

const useGetQuestionnaireRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();

  const loading = ref(null);

  const getQuestionnaire = (async (questionnaireId) => {
    loading.value = true;
    const QuestionnaireModel = modelRepository.getEndpointModel('Questionnaire', 'fhir/questionnaire');
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);
    loading.value = false;
    return questionnaire;
  });

  const addGroupsToQuestionnaireResponse = ((questionnaireData, questionnaireResponse) => {
    if (questionnaireResponse === null) {
      return null;
    }
    const groupPerQuestion = {};
    if ('item' in questionnaireData && Array.isArray(questionnaireData.item)) {
      questionnaireData.item.forEach((groupItem) => {
        if ('type' in groupItem && groupItem.type === 'group'
            && 'text' in groupItem
            && 'item' in groupItem && Array.isArray(groupItem.item)
        ) {
          groupItem.item.forEach((questionItem) => {
            if ('linkId' in questionItem) {
              groupPerQuestion[questionItem.linkId] = groupItem.text;
            }
          });
        }
      });
    }

    const responseWithGroup = questionnaireResponse;

    if ('item' in questionnaireResponse && Array.isArray(questionnaireResponse.item)) {
      questionnaireResponse.item.forEach((questionItem, index) => {
        if ('linkId' in questionItem && questionItem.linkId in groupPerQuestion) {
          responseWithGroup.item[index].group = groupPerQuestion[questionItem.linkId];
        }
      });
    }
    return responseWithGroup;
  });

  return {
    addGroupsToQuestionnaireResponse,
    loading,
    getQuestionnaire,
  };
});

export default useGetQuestionnaireRepository;