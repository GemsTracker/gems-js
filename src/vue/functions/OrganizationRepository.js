import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useOrganizationRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getOrganizations = (async () => {
    loading.value = true;
    const organziationModel = modelRepository.getEndpointModel('Organizations', 'fhir/organization');
    organziationModel.idField = null;
    organziationModel.per_page = 100;
    const organizations = await organziationModel.all();
    loading.value = false;
    return organizations.sort(sortFieldsFunction(['name']));
  });

  const getOrganizationPairs = (async () => {
    const organizations = await getOrganizations();
    const pairs = {};
    Object.values(organizations).forEach((organization) => {
      pairs[organization.id] = organization.name;
    });

    return pairs;
  });

  return {
    loading,
    getOrganizations,
    getOrganizationPairs,
  };
});

export default useOrganizationRepository;
