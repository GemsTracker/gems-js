import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useInsertableQuestionnaireRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const insertableQuestionnaireModel = modelRepository.getModel('InsertableQuestionnaire', 'insertable-questionnaire');
  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getInsertableQuestionnaireForOrganization = (async (organizationId) => {
    loading.value = true;
    const filter = {
      organization: organizationId,
      per_page: 200,
    };
    const tracks = await insertableQuestionnaireModel.all(filter);
    loading.value = false;
    return tracks.sort(sortFieldsFunction(['name']));
  });

  return {
    loading,
    getInsertableQuestionnaireForOrganization,
  };
});

export default useInsertableQuestionnaireRepository;
