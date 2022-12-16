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
    const rawCarePlans = await carePlanModel.all({ per_page: 200 });
    const carePlanArray = Object.values(rawCarePlans);
    console.log(carePlanArray);
    const augmentedCarePlans = carePlanArray.map((carePlan) => {
      const augmentedCarePlan = carePlan;
      // Add start for easier sort
      augmentedCarePlan.start = carePlan.period.start;
      return augmentedCarePlan;
    });
    console.log(augmentedCarePlans);
    loading.value = false;
    return augmentedCarePlans.sort(sortFieldsFunction(['-start']));
  });

  return {
    loading,
    getAllCarePlans,
  };
});

export default useCarePlanRepository;
