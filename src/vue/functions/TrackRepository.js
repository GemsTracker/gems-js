import { ref } from 'vue';
import useArrayObjectFunctions from './ArrayObject';
import useGetModelRepository from './modelRepository';

const useTrackRepository = (() => {
  const { getModelRepository } = useGetModelRepository();
  const modelRepository = getModelRepository();
  const trackModel = modelRepository.getEndpointModel('Track', 'tracks');
  trackModel.idField = null;
  const { sortFieldsFunction } = useArrayObjectFunctions();

  const loading = ref(null);

  const getTracksForOrganization = (async (organizationId) => {
    loading.value = true;
    const filter = {
      organization: organizationId,
      active: 1,
      valid: 1,
      per_page: 200,
    };
    const tracks = await trackModel.all(filter);
    console.log(tracks);

    loading.value = false;
    return tracks.sort(sortFieldsFunction(['name']));
  });

  const getTrack = (async (trackId) => {
    loading.value = true;
    const carePlan = await trackModel.findById(trackId);
    loading.value = false;
    return carePlan;
  });

  return {
    loading,
    getTrack,
    getTracksForOrganization,
  };
});

export default useTrackRepository;
