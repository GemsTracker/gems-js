import { ref } from 'vue';
// import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useCommFieldsRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  // const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getCommFieldsForTarget = (async (target, filter = null) => {
    console.log('comm fields for target', target, filter);
    loading.value = true;
    const commFieldsModel = modelRepository.getEndpointModel(`CommFields_${target}`, `comm-fields/${target}`, { idField: null });
    const commFields = await commFieldsModel.all(filter);
    console.log(commFields);
    loading.value = false;
    return commFields;
  });

  return {
    loading,
    getCommFieldsForTarget,
  };
});

export default useCommFieldsRepository;
