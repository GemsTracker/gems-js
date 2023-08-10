import { ref } from 'vue';
import useGetModelRepository from './modelRepository';

const useQuestionnaireResponseRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();

  const loading = ref(null);

  const getQuestionnaireResponse = (async (token) => {
    loading.value = true;
    const QuestionnaireResponseModel = modelRepository.getEndpointModel('QuestionnaireResponse', 'fhir/questionnaire-response');
    const questionnaireResponse = await QuestionnaireResponseModel.findById(token);
    loading.value = false;
    return questionnaireResponse;
  });

  const getRawAnswer = ((answerItem) => {
    if (answerItem === null) {
      return null;
    }
    if ('valueString' in answerItem) {
      return answerItem.valueString;
    }
    if ('valueInteger' in answerItem) {
      return answerItem.valueInteger;
    }
    if ('valueDecimal' in answerItem) {
      return answerItem.valueDecimal;
    }
    if ('valueCoding' in answerItem) {
      if (answerItem.valueCoding.code === null) {
        return null;
      }
      return answerItem.valueCoding.code;
    }
    return null;
  });

  const getAnswer = ((answerInfo, defaultValue = null) => {
    const rawAnswer = getRawAnswer(answerInfo);
    if (answerInfo !== null && 'valueCoding' in answerInfo) {
      if (answerInfo.valueCoding.code === null && defaultValue === null) {
        return defaultValue;
      }
      return answerInfo.valueCoding.display;
    }

    if (answerInfo === null) {
      return defaultValue;
    }
    return rawAnswer;
  });

  const getRawAnswerPairs = ((answerItems) => {
    const pairs = {};
    console.log(answerItems);
    answerItems.forEach((answerItem) => {
      if (answerItem !== null && 'answer' in answerItem) {
        pairs[answerItem.linkId] = getRawAnswer(answerItem.answer);
      }
    });
    console.log(pairs);
    return pairs;
  });

  return {
    loading,
    getAnswer,
    getRawAnswer,
    getRawAnswerPairs,
    getQuestionnaireResponse
  };
});

export default useQuestionnaireResponseRepository;