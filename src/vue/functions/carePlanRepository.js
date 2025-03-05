import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useCarePlanRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const carePlanModel = modelRepository.getModel('CarePlan');

  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getAllCarePlans = (async () => {
    loading.value = true;
    const carePlanArray = await carePlanModel.all({ per_page: 200, allAllowedOrgs: true });
    if (carePlanArray === null) {
      loading.value = false;
      return [];
    }
    const augmentedCarePlans = carePlanArray.map((carePlan) => {
      const augmentedCarePlan = carePlan;
      // Add start for easier sort
      augmentedCarePlan.start = carePlan.period.start;
      return augmentedCarePlan;
    });
    loading.value = false;
    return augmentedCarePlans.sort(sortFieldsFunction(['-start']));
  });

  const getCarePlan = (async (carePlanId) => {
    loading.value = true;
    const carePlan = await carePlanModel.findById(carePlanId);
    loading.value = false;
    return carePlan;
  });

  return {
    loading,
    getAllCarePlans,
    getCarePlan,
  };
});

export default useCarePlanRepository;
